<script setup lang="ts">
	import { ProgressSpinner, DataTable, Button, Column } from 'primevue'
	import { usersHeader } from './constants'
	import { ref } from 'vue'
	import RybChip from '../../../components/generic/RybChip.vue'

	const loading = ref(false)
</script>

<template>
	<div
		class="flex align-items-center justify-content-center"
		style="min-height: 50vh"
	>
		<ProgressSpinner />
		<DataTable :value="loading ? new Array(20) : []">
			<template #header>
				<Button label="Add new" raised size="small" text />
			</template>
			<Column
				v-for="column of usersHeader"
				:key="column.key"
				:field="column.key"
				:header="column.title"
			>
				<template #body="{ data, index }">
					<Skeleton v-if="loading" />
					<template v-else>
						<RybChip v-if="column.key === 'role'" :name="data[column.key]" />
						<Button
							v-else-if="column.key === 'remove'"
							icon="pi pi-trash"
							class="p-button-rounded p-button-danger"
						/>
						<div v-else>
							{{ data[column.key] }}
						</div>
					</template>
				</template>
			</Column>

			<!-- <template v-if="!store.customers.isLoading" #empty>
				<div
					class="tw3-w-full tw3-h-full tw3-flex tw3-justify-center tw3-items-center"
				>
					<p class="tw3-text-center tw3-text-3xl">{{ t('noData') }}</p>
				</div>
			</template> -->
		</DataTable>
	</div>
</template>
