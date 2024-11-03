<script lang="ts" setup>
	import { Image } from 'primevue'

	withDefaults(
		defineProps<{
			imageUrl?: string | null
			alt?: string
			width?: number
			preview?: boolean
			scale?: number
			aspectRatio?: number
			originRatio?: boolean
			dominantColor?: string
		}>(),
		{
			preview: false,
		}
	)
</script>

<template>
	<div class="ryb-image-container" v-bind="$attrs">
		<Image
			class="ryb-image"
			:src="imageUrl ?? '1x1.png'"
			:alt="alt ?? imageUrl"
			:preview="preview"
			loading="lazy"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.ryb-image-container {
		position: relative;
		display: flex;
		width: 100%;
		overflow: hidden;
		transition: 0.25s ease;
		transition-property: background-color, opacity, transform;

		.ryb-image {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;

			:deep(img) {
				object-fit: cover;
				width: 100%;
				height: 100%;
			}
		}
	}
	.ryb-image-container-absolute .ryb-image {
		position: absolute;
	}
</style>
