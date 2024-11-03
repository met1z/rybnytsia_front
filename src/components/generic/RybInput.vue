<script lang="ts" setup>
	import type { ErrorObject } from '@vuelidate/core'
	import type { StyleValue } from 'vue'

	import RybFieldError from './RybFieldError.vue'
	import { InputText } from 'primevue'

	withDefaults(
		defineProps<{
			modelValue: string | undefined | null
			label?: string
			showErrors?: boolean
			errors?: ErrorObject[]
			inputClass?: string[] | string | object
			inputStyle?: StyleValue
			autofocus?: boolean
			disabled?: boolean
			placeholder?: string
			describe?: string
			required?: boolean
			maxLength?: number
		}>(),
		{
			disabled: false,
		}
	)

	const emit = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
	}>()

	const updateModel = (e?: string) => {
		if (!e || !e.length) emit('update:modelValue', undefined)
		else emit('update:modelValue', e)
	}
</script>

<template>
	<div class="field">
		<label v-if="label" for="rybInput" class="field-title"
			>{{ label }} <span v-if="required">*</span>
			<div v-if="maxLength" class="field-symbols">
				{{ `${modelValue?.length ?? 0}/${maxLength}` }}
			</div></label
		>
		<div class="field-input">
			<slot name="prepend"></slot>
			<div class="field-input-wrapper">
				<InputText
					class="w-full"
					:model-value="modelValue"
					@update:model-value="updateModel"
					id="rybInput"
					:maxlength="maxLength"
					:autofocus="autofocus"
					:class="inputClass"
					:style="inputStyle"
					:disabled="disabled"
					:placeholder="placeholder"
					aria-describedby="rybInput-help"
				/>
			</div>
			<slot name="append"></slot>
		</div>
		<small
			v-if="describe && !(errors?.length && showErrors)"
			id="rybInput-help"
			>{{ describe }}</small
		>
		<ryb-field-error v-if="errors?.length && showErrors" :errors="errors" />
	</div>
</template>

<style lang="scss" scoped>
	.field-input {
		display: flex;
		width: 100%;

		.field-input-wrapper {
			display: flex;
			flex: 1;
		}
	}
</style>
