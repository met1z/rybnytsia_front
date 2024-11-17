<script lang="ts" setup>
	import type { ErrorObject } from '@vuelidate/core'
	import { computed } from 'vue'
	import { Dropdown } from 'primevue'
	import RybFieldError from './RybFieldError.vue'

	const props = defineProps<{
		modelValue: unknown
		options: Array<object | string | number>
		label?: string
		optionLabel?: string
		optionValue?: string
		placeholder?: string
		showErrors?: boolean
		errors?: ErrorObject[]
		dropdownClass?: string[] | string | object
		disabled?: boolean
		required?: boolean
		infoMessage?: string
	}>()

	const emit = defineEmits<{
		(e: 'update:modelValue', value: unknown): void
	}>()

	const updateModel = (e: unknown) => {
		emit('update:modelValue', e)
	}
</script>

<template>
	<div class="field w-full">
		<label v-if="label || infoMessage" for="rybDropdown" class="field-title">
			<span>{{ label }}</span>
			<span v-if="required">*</span>
			<span v-if="infoMessage" v-tooltip.top="infoMessage" class="ml-auto">
				<i class="mdi mdi-information-outline"></i>
			</span>
		</label>
		<Dropdown
			class="w-full"
			id="rybDropdown"
			v-bind="$attrs"
			:model-value="modelValue"
			@update:model-value="updateModel"
			:disabled="disabled"
			:options="options"
			:class="dropdownClass"
			:placeholder="placeholder"
			:option-label="optionLabel"
			:option-value="optionValue"
		/>
		<RybFieldError v-if="errors?.length && showErrors" :errors="errors" />
	</div>
</template>
