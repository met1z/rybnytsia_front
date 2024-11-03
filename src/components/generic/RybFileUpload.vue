<script lang="ts" setup>
	import { computed, type Ref, ref, toRefs, watch } from 'vue'

	import RybPhoto from './RybPhoto.vue'

	const file = ref<File>()
	const fileInput = ref<HTMLInputElement | null>(null)

	const props = withDefaults(
		defineProps<{
			accept: string
			url?: string
			aspectRatio?: number
			hasErrors?: boolean
			outerFile?: File
			disabled?: boolean
			originRatio?: boolean
		}>(),
		{
			disabled: false,
		}
	)
	const emit = defineEmits<{
		(e: 'change', file: File | undefined): void
	}>()
	const { outerFile } = toRefs(props)

	watch(outerFile as Ref<File | undefined>, evt => {
		file.value = evt
	})

	const createObjectURL = computed(() =>
		file.value ? window.URL.createObjectURL(file.value) : props.url
	)

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
		if (list.length) {
			file.value = list.item(0) ?? undefined
		}
		emit('change', file.value)
		clearInputElement()
	}

	const clear = () => {
		file.value = undefined
		emit('change', file.value)
	}
</script>
<template>
	<div class="ryb-upload-wrapper">
		<slot name="prepend"></slot>
		<div
			class="ryb-preview"
			:class="{
				'ryb-border-error-color': hasErrors,
				'ryb-preview-wider': originRatio,
			}"
		>
			<ryb-photo
				:image-url="createObjectURL"
				:aspect-ratio="aspectRatio"
				:origin-ratio="originRatio"
				:scale="0"
				preview
			/>
		</div>
		<div class="actions">
			<span
				:class="{ 'p-disabled': disabled }"
				class="p-button p-component p-fileupload-choose"
				v-ripple
				tabindex="0"
				@click="choose"
			>
				<input
					:disabled="disabled"
					ref="fileInput"
					type="file"
					@change="onFileSelect"
					:accept="accept"
				/>
				<span class="p-button-icon p-button-icon-left pi pi-upload"></span>
				<span class="p-button-label">New</span>
			</span>
			<prime-button :disabled="!file" icon="pi pi-times" @click="clear" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.p-button.p-fileupload-choose {
		position: relative;
		overflow: hidden;
	}

	.ryb-upload-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1.5rem;

		.ryb-preview,
		.actions {
			display: flex;
			width: 125px;

			input {
				display: none;
			}
		}

		.ryb-preview {
			display: flex;
			border: 1px solid #e9ecef;
			border-radius: 3px;
			margin-bottom: 0.625rem;
			overflow: hidden;
			user-select: none;
			padding: 1px;
		}

		.ryb-preview-wider {
			width: 205px;
		}

		.actions {
			justify-content: space-between;
		}
	}
</style>
