import { updatedDiff } from 'deep-object-diff'
import { cloneDeep, isEqual, omitBy } from 'lodash'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'

import { PixioNoChangesError } from '../../../../common/classes/errors/pixio-no-changes-error'
import {
  CHANGED_STATUS_MESSAGE,
  CREATED_MESSAGE,
  ERROR_MESSAGE,
  REMOVED_MESSAGE,
  UPDATED_MESSAGE,
} from '../../../../common/constants'
import { ImageAspectRatio } from '../../../../common/enums/image-aspect-ratio.enum'
import { composeSetRemove } from '../../../../common/utils/compose-set-remove.util'
import { optionsToPaginationParams } from '../../../../common/utils/options-to-pagination-params.util'
import { patchSortBy } from '../../../../common/utils/patch-sort-by.util'
import { useImages } from '../../../../composables/files/useImages'
import { useIAM } from '../../../../composables/iam/useIAM'
import { useChallengeStore } from '../../../../stores/challenge/challenge.store'
import { useHomeStore } from '../../../../stores/home'
import { useSets } from '../../pixio-sets/composables/useSets'
import api from '../actions/challenge.action'
import type { Challenge } from '../interfaces/challenge.interface'
import type { CreateChallengeModal } from '../interfaces/create-challenge-modal.interface'
import type { UpdateChallenge } from '../interfaces/update-challenge.interface'
import type { UpdateChallengeModal } from '../interfaces/update-challenge.modal.interface'
import type { UpdateSetRemoveChallenge } from '../interfaces/update-set-remove-challenge.interface'

export const useChallenge = () => {
  const store = useChallengeStore()
  const homeStore = useHomeStore()
  const toast = useToast()
  const { createImage, removeImage } = useImages()
  const { tryFindAndUpdateLastUpdatedBy } = useIAM()
  const { fetchShortSet } = useSets()

  const fetch = async () => {
    const params = optionsToPaginationParams(store.paginationInfo, store.pageInfo)
    store.patchPaginationInfo({ currentPage: store.paginationInfo.page })
    try {
      const { nodes, pageInfo, totalCount } = await api.fetch(params)
      store.addEntityConnection(nodes, pageInfo, totalCount)
    } catch (e) {
      toast.add(ERROR_MESSAGE(e))
    }
  }
  const fetchInit = async () => {
    if (store.entitiesExist) return false
    await fetch()
  }

  const fetchWithSort = async ({ sortField, sortOrder }: DataTableSortEvent) => {
    store.patchPaginationInfo(patchSortBy(sortField, sortOrder))
    store.resetPageInfo()
    await fetch()
  }
  const fetchOne = async (id: string) => {
    if (store.entity?.id === id) return store.entity
    const data = await api.fetchOne(id)
    store.addEntity(data)
    await tryFindAndUpdateLastUpdatedBy({ id: data.lastUpdatedBy, store })
    return data
  }
  const fetchOneOnly = async (id: string) => api.fetchOne(id)
  const fetchChallengesWithQuery = async (query?: string, published?: boolean) => {
    const params = new URLSearchParams()
    params.append('first', '50')
    if (published) params.append('published', 'true')
    if (query) params.append('query', query)
    return api.fetch(params)
  }
  const create = async ({
    imageFile,
    imageFileRect,
    mailImageFileTop,
    mailImageFileBottom,
    ...data
  }: CreateChallengeModal) => {
    const [imageUrl, imageUrlRect, mailImageUrlTop, mailImageUrlBottom] = await Promise.all([
      createImage(imageFile),
      createImage(imageFileRect, { aspectRatio: ImageAspectRatio.rect16x9 }),
      createImage(mailImageFileTop),
      mailImageFileBottom ? createImage(mailImageFileBottom) : undefined,
    ])
    const newCollection = await api.create({ ...data, imageUrl, imageUrlRect, mailImageUrlTop, mailImageUrlBottom })
    store.addToStart(newCollection)
    toast.add(CREATED_MESSAGE)
  }
  const update = async (
    id: string,
    { imageFile, imageFileRect, mailImageFileTop, mailImageFileBottom, ...newItem }: UpdateChallengeModal,
    oldItem: UpdateChallenge,
  ) => {
    const [newImageUrl, newImageUrlRect, newMailImageUrlTop, newMailImageUrlBottom] = await Promise.all([
      imageFile ? createImage(imageFile) : undefined,
      imageFileRect ? createImage(imageFileRect, { aspectRatio: ImageAspectRatio.rect16x9 }) : undefined,
      mailImageFileTop ? createImage(mailImageFileTop) : undefined,
      mailImageFileBottom ? createImage(mailImageFileBottom) : undefined,
    ])
    const imageUrl = newImageUrl ?? oldItem.imageUrl
    const imageUrlRect = newImageUrlRect ?? oldItem.imageUrlRect
    const mailImageUrlTop = newMailImageUrlTop ?? oldItem.mailImageUrlTop
    const mailImageUrlBottom = newMailImageUrlBottom ?? oldItem.mailImageUrlBottom
    const newItemToCompare = { ...newItem, imageUrl, imageUrlRect, mailImageUrlTop, mailImageUrlBottom }
    const diff: UpdateChallenge = updatedDiff(cloneDeep(oldItem), newItemToCompare)

    // Diff don`t catch attributes changes in descriptionDeltaDiff so need check to isEqual
    if (isEqual(oldItem, newItemToCompare)) throw new PixioNoChangesError()
    const { descriptionDelta: _d, ...rest } = diff
    const applyPrizeChanges = omitBy({ prize: diff.prize ? newItem.prize : undefined }, (v) => v === undefined)
    const descriptionDelta = !isEqual(oldItem.descriptionDelta, newItemToCompare.descriptionDelta)
      ? { descriptionDelta: newItem.descriptionDelta }
      : undefined
    // const descriptionDelta = omitBy({ prize: diff.prize ? newItem.prize : undefined }, (v) => v === undefined)
    const setRemove: UpdateSetRemoveChallenge = composeSetRemove({ ...rest, ...descriptionDelta, ...applyPrizeChanges })
    const data = await api.update(id, setRemove)
    if (store.entity?.lastUpdatedBy !== data.lastUpdatedBy)
      await tryFindAndUpdateLastUpdatedBy({ id: data.lastUpdatedBy, store })

    if (
      'setId' in data.prize &&
      (!oldItem.prize || 'setId' in oldItem.prize) &&
      data.prize.setId &&
      data.prize.setId !== oldItem.prize?.setId
    ) {
      const set = await fetchShortSet(data.prize.setId)
      store.addPrizeSetToChallenge(set)
    }
    store.updateOnConnection(id, data)
    store.updateEntity(data)

    if (imageFile && oldItem.imageUrl) {
      removeImage(oldItem.imageUrl).catch(() => {
        throw new Error('Failed to remove old image')
      })
    }
    // When unpublishing a Challenge, BlockChallenge will be unpublished on the backend, so we have to drop the cache
    if (oldItem.published && !data.published) homeStore.$reset()
    toast.add(UPDATED_MESSAGE)
  }
  const remove = async ({ id, imageUrl }: Challenge) => {
    try {
      const resp = await api.remove([id])
      if (resp) {
        store.removeEntityByKey(id)
        if (id === store.entity?.id) store.addEntity(undefined)
        await removeImage(imageUrl)
        toast.add(REMOVED_MESSAGE)
      }
    } catch (e) {
      toast.add(ERROR_MESSAGE(e))
    }
  }
  const changeStatus = async (entityId: string, data: UpdateChallenge & Pick<Challenge, 'lastUpdatedBy'>) => {
    try {
      const { id, published, lastUpdatedBy } = await api.update(entityId, { set: { published: !data.published } })
      if (data.lastUpdatedBy && data.lastUpdatedBy !== lastUpdatedBy)
        await tryFindAndUpdateLastUpdatedBy({ id: lastUpdatedBy, store })
      store.updateOnConnection(id, { published })
      store.updateEntity({ id, published })
      // When unpublishing a Challenge, BlockChallenge will be unpublished on the backend, so we have to drop the cache
      if (!published) homeStore.$reset()
      toast.add(CHANGED_STATUS_MESSAGE)
    } catch (e) {
      toast.add(ERROR_MESSAGE(e))
    }
  }

  return {
    fetchInit,
    fetchMore,
    fetchChallengesWithQuery,
    fetchOne,
    fetchWithSort,
    create,
    update,
    remove,
    changeStatus,
    fetchOneOnly,
  }
}
