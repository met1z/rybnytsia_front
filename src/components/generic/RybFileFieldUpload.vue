<script lang="ts" setup>
	import type { ErrorObject } from '@vuelidate/core'
	import { computed, ref } from 'vue'

	import RybFieldError from './RybFieldError.vue'

	const fileInput = ref<HTMLInputElement | null>(null)

	const props = withDefaults(
		defineProps<{
			modelValue: File | File[] | undefined
			label: string
			accept: string
			disabled?: boolean
			multiple?: boolean
			inputClass?: string[] | string | object
			showErrors?: boolean
			errors?: ErrorObject[]
			required?: boolean
		}>(),
		{
			disabled: false,
			multiple: false,
			required: false,
		}
	)
	const emit = defineEmits<{
		(e: 'update:modelValue', files: File | File[] | undefined): void
	}>()
	const fileChips = computed(() => {
		if (!props.modelValue) return []
		return Array.isArray(props.modelValue)
			? props.modelValue
			: [props.modelValue]
	})

	const choose = () => {
		if (!fileInput.value) throw new Error('File input not found')
		fileInput.value.click()
	}

	const clearInputElement = () => {
		if (!fileInput.value) throw new Error('File input not found')
		fileInput.value.value = ''
	}

	const onFileSelect = (event: Event) => {
		const typedEvent = event as DragEvent & { target: { files: FileList } }
		const list = typedEvent.dataTransfer
			? typedEvent.dataTransfer.files
			: typedEvent.target?.files
		const files: File[] = []
		if (props.multiple) {
			for (let index = 0; index < list.length; index++) {
				const item = list.item(index)
				if (item) files.push(item)
			}
			emit('update:modelValue', files)
		} else {
			const item = list.item(0)
			if (list.length && item) {
				emit('update:modelValue', item)
			}
		}
		clearInputElement()
	}

	const remove = (index: number) => {
		if (Array.isArray(props.modelValue)) {
			const files = props.modelValue.filter(
				(_, indexModel) => indexModel !== index
			)
			emit('update:modelValue', files)
		} else emit('update:modelValue', undefined)
	}
</script>
<template>
	<div class="field">
		<label v-if="label" for="rybInput" class="field-title"
			>{{ label }} <span v-if="required">*</span></label
		>
		<div class="field-upload">
			<span
				:class="{ 'p-disabled': disabled }"
				class="p-button p-component p-fileupload-choose"
				v-ripple
				tabindex="0"
				@click="choose"
			>
				<input
					:multiple="multiple"
					:disabled="disabled"
					ref="fileInput"
					type="file"
					@change="onFileSelect"
					:accept="accept"
				/>
				<span class="p-button-icon pi pi-upload"></span>
			</span>
			<div class="chips-upload" :class="inputClass">
				<div
					v-for="(file, index) in fileChips"
					:key="file.name"
					:name="file.name"
					class="ryb-chip"
				>
					<div>{{ file.name }}</div>
					<div @click="remove(index)" class="close-chip">
						<i class="mdi mdi-close"></i>
					</div>
				</div>
			</div>
		</div>
		<ryb-field-error v-if="errors?.length && showErrors" :errors="errors" />
	</div>
</template>

<style lang="scss" scoped>
	.p-button.p-fileupload-choose {
		position: relative;
		overflow: hidden;

		input {
			display: none;
		}
	}

	.field-upload {
		display: flex;
		flex: 1;
		align-items: flex-start;

		.p-fileupload-choose {
			height: 36px;
		}

		.chips-upload {
			display: flex;
			flex: 1;
			flex-wrap: wrap;
			margin-left: 1rem;
			overflow: auto hidden;
			border-radius: 3px;
			font-size: 1rem;
			color: #495057;
			background: #ffffff;
			padding: 0.25rem;
			border: 1px solid #ced4da;
			white-space: nowrap;
			min-height: 36px;

			.ryb-chip {
				display: flex;
				align-items: center;
				border-radius: 5px;
				background-color: #e8eaed;
				padding: 0.25rem 0.375rem;
				margin: 0.125rem;

				.close-chip {
					display: flex;
					margin-left: 0.25rem;
					cursor: pointer;
				}
			}
		}
	}
</style>
