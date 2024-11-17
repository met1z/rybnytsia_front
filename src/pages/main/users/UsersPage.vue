<script setup lang="ts">
	import {
		DataTable,
		Button,
		Column,
		DataTablePageEvent,
		Skeleton,
		useConfirm,
	} from 'primevue'
	import { usersHeader } from './constants'
	import { defineAsyncComponent, onMounted, ref } from 'vue'
	import RybChip from '../../../components/generic/RybChip.vue'
	import { useUsers } from './composables/useUsers'
	import { useUserStore } from '../../../stores/user'
	import { storeToRefs } from 'pinia'
	import { User } from '../../../common/interfaces/user.interface'
	import { removeConfirmGeneric } from '../../../common/utils/remove-confirm-generic.util'
	import { UserRoles } from '../../../common/enums/user-roles.enum'
	import { useUserHydrate } from './composables/useUserHydrate'

	const HydrateUser = defineAsyncComponent(
		() => import('./modals/HydrateUser.vue')
	)

	const confirm = useConfirm()
	const store = useUserStore()
	const service = useUsers()
	const {
		sendHydratedData,
		openCreateDialog,
		closeDialog,
		hydrate,
		hydrateOptions,
	} = useUserHydrate()
	const { entities, meta } = storeToRefs(store)

	const loading = ref(true)

	const onPage = async ({ page, rows }: DataTablePageEvent) => {
		loading.value = true
		await service.fetch(page + 1, rows)
		loading.value = false
	}
	const changeRoleConfirm = (data: User) => {
		let newRole = UserRoles.ADMIN
		if (newRole === data.role) newRole = UserRoles.EDITOR

		confirm.require({
			accept: () => service.changeRole(data.id, newRole),
			acceptProps: {
				severity: 'success',
			},
			header: 'Change Role Confirmation',
			message: `Do you want to change role of this user to ${newRole}?`,
			rejectProps: {
				severity: 'secondary',
			},
		})
	}
	const removeConfirm = (data: User) =>
		confirm.require(removeConfirmGeneric(() => service.remove(data)))

	onMounted(() => {
		service.fetch()
		loading.value = false
	})
</script>

<template>
	<div class="flex w-full">
		<HydrateUser
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
				<Button label="Add new" raised size="small" text @click="openCreateDialog" />
			</template>
			<Column
				v-for="column of usersHeader"
				:key="column.key"
				:field="column.key"
				:header="column.title"
			>
				<template #body="{ data }">
					<Skeleton v-if="loading" />
					<template v-else>
						<button
							v-if="column.key === 'role'"
							type="button"
							style="
								padding: 0;
								border: 0;
								background-color: transparent;
								cursor: pointer;
							"
							@click="changeRoleConfirm(data)"
						>
							<RybChip
								:name="data[column.key]"
								:style="
									'background-color: ' +
									(data[column.key] === UserRoles.ADMIN
										? 'rgb(248 113 113)'
										: 'rgb(251 191 36)')
								"
							/>
						</button>
						<Button
							v-else-if="column.key === 'remove'"
							icon="pi pi-trash"
							class="p-button-rounded p-button-danger"
							@click="removeConfirm(data)"
						/>
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
