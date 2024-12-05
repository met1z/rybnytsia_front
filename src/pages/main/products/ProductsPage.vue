<script setup lang="ts">
	import {
		DataTable,
		Button,
		Column,
		DataTablePageEvent,
		Skeleton,
		useConfirm,
	} from 'primevue'
	import { categoriesHeader } from './constants'
	import { defineAsyncComponent, onMounted, ref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { removeConfirmGeneric } from '../../../common/utils/remove-confirm-generic.util'
	import RybStatusChip from '../../../components/generic/RybStatusChip.vue'
	import RybPhoto from '../../../components/generic/RybPhoto.vue'
	import { useProductHydrate } from './composables/useProductHydrate'
	import { Product } from './interfaces/product.interface'
	import { useProductStore } from '../../../stores/product'
	import { useProduct } from './composables/useProduct'

	const HydrateProduct = defineAsyncComponent(
		() => import('./modals/HydrateProduct.vue')
	)

	const confirm = useConfirm()
	const store = useProductStore()
	const service = useProduct()
	const {
		openEditDialog,
		sendHydratedData,
		openCreateDialog,
		closeDialog,
		hydrate,
		hydrateOptions,
	} = useProductHydrate()
	const { entities, meta } = storeToRefs(store)

	const loading = ref(true)

	const onPage = async ({ page, rows }: DataTablePageEvent) => {
		loading.value = true
		await service.fetch(page + 1, rows)
		loading.value = false
	}
	const removeConfirm = (data: Product) =>
		confirm.require(removeConfirmGeneric(() => service.remove(data)))

	onMounted(() => {
		service.fetch()
		loading.value = false
	})
</script>

<template>
	<div class="flex w-full">
		<HydrateProduct
			v-bind="hydrateOptions"
			@close="closeDialog"
			@save="d => hydrate(d, sendHydratedData)"
		/>
		<DataTable
			:value="loading ? new Array(10) : entities"
			:totalRecords="meta?.totalItems"
			paginator
			lazy
			:rows="50"
			:first="
				meta?.currentPage && meta?.itemsPerPage
					? (meta.currentPage - 1) * meta.itemsPerPage
					: undefined
			"
			paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
			currentPageReportTemplate="{first} to {last} of {totalRecords}"
			class="w-full"
			@page="onPage"
		>
			<template #header>
				<Button
					label="Add new"
					raised
					size="small"
					text
					@click="openCreateDialog"
				/>
			</template>
			<Column
				v-for="column of categoriesHeader"
				:key="column.key"
				:field="column.key"
				:header="column.title"
			>
				<template #body="{ data }">
					<Skeleton v-if="loading" />
					<template v-else>
						<div
							v-if="column.key === 'published'"
							class="ryb-table-content-default"
						>
							<RybStatusChip :data="!!data[column.key]" />
						</div>
						<div v-else-if="column.key === 'imageUrl'" class="ryb-table-image">
							<RybPhoto :image-url="data[column.key]" />
						</div>
						<div v-else-if="column.key === 'actions'" class="flex">
							<Button
								icon="pi pi-pencil"
								class="mr-2 p-button-rounded p-button-warning"
								@click="openEditDialog(data)"
							/>
							<Button
								icon="pi pi-trash"
								class="p-button-rounded p-button-danger"
								@click="removeConfirm(data)"
							/>
						</div>
						<div v-else-if="column.key === 'category'">
							{{ data[column.key]?.name || 'Empty' }}
						</div>
						<div v-else>
							{{ data[column.key] }}
						</div>
					</template>
				</template>
			</Column>

			<template v-if="!loading" #empty>
				<div
					class="tw3-w-full tw3-h-full tw3-flex tw3-justify-center tw3-items-center"
				>
					<p class="tw3-text-center tw3-text-3xl">No data</p>
				</div>
			</template>
		</DataTable>
	</div>
</template>
