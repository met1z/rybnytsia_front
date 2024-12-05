<script lang="ts" setup>
	import useVuelidate from '@vuelidate/core'
	import { cloneDeep } from 'lodash'
	import { storeToRefs } from 'pinia'
	import { computed, ref, toRefs, watch } from 'vue'

	import { useModal } from '../../../../common/composables/useModal'
	import { rybName } from '../../../../common/validators/ryb-name-validator'
	import { rybRequired } from '../../../../common/validators/ryb-required.validator'
	import RybSaveWrapperDialog from '../../../../components/generic/RybSaveWrapperDialog.vue'
	import RybInput from '../../../../components/generic/RybInput.vue'
	import RybFileUpload from '../../../../components/generic/RybFileUpload.vue'
	import RybPublishedCheckbox from '../../../../components/generic/RybPublishedCheckbox.vue'
	import { CreateProductModal } from '../interfaces/create-product-modal.interface'
	import { UpdateProduct } from '../interfaces/update-product.interface'
	import { UpdateProductModal } from '../interfaces/update-product-modal.interface'
	import RybDropdown from '../../../../components/generic/RybDropdown.vue'
	import { useCategoryStore } from '../../../../stores/category'
	import { useCategory } from '../../categories/composables/useCategory'

	const categoryStore = useCategoryStore()
	const categoryService = useCategory()
	const { entities: categories, entitiesExist: categoriesExist } =
		storeToRefs(categoryStore)
	const emit = defineEmits<{
		(e: 'close'): void
		(e: 'save', payload: CreateProductModal): void
	}>()
	const props = defineProps<{
		options: { isCreated?: boolean; header: string }
		dialog: boolean
		loading: boolean
		data?: UpdateProduct
	}>()
	const { dialog } = toRefs(props)

	const show = computed({ get: () => props.dialog, set: () => emit('close') })

	const stateInitial = {
		name: undefined,
		imageFile: undefined,
		price: undefined,
		categoryId: undefined,
		published: false,
	}

	const state = ref<UpdateProductModal>({ ...stateInitial })
	const rules = computed(() => {
		const alwaysExisted = {
			name: rybName(),
			price: { required: rybRequired('Price') },
			categoryId: { required: rybRequired('Category') },
		}
		return props.options.isCreated
			? {
					...alwaysExisted,
					imageFile: { required: rybRequired('Image') },
			  }
			: alwaysExisted
	})
	const v$ = useVuelidate(rules, state)
	const { validateModal, afterHide, submitted } = useModal(v$, state)

	const save = async () => {
		const isValid = await validateModal()
		if (!isValid) return

		emit('save', state.value as unknown as CreateProductModal)
	}

	const fileImageChange = (f: File | undefined) => {
		state.value.imageFile = f
	}

	watch(dialog, async () => {
		state.value = cloneDeep({
			...stateInitial,
			...props.data,
		})
		if (!categoriesExist.value) await categoryService.fetch()
	})
</script>
<template>
	<RybSaveWrapperDialog
		v-model="show"
		:header="options.header"
		:loading="loading"
		@after-hide="afterHide(stateInitial)"
		@close="show = false"
		@save="save"
	>
		<div class="upload-files-block">
			<RybFileUpload
				class="upload-file"
				accept="image/*"
				:has-errors="v$.imageFile?.$invalid && submitted"
				:url="props.data?.imageUrl"
				@change="fileImageChange"
			/>
		</div>
		<RybInput
			class="p-fluid"
			label="Name"
			required
			v-model="v$.name.$model"
			:max-length="v$.name.maxLengthValue.$params.max"
			:input-class="{ 'p-invalid': v$.name.$invalid && submitted }"
			:errors="v$.name.$errors"
			:show-errors="submitted"
			:autofocus="true"
		/>
		<RybInput
			class="p-fluid"
			label="Price"
			required
			v-model="v$.price.$model"
			:input-class="{ 'p-invalid': v$.price.$invalid && submitted }"
			:errors="v$.price.$errors"
			:show-errors="submitted"
			:autofocus="true"
		/>
		<RybDropdown
			class="p-fluid"
			label="Category"
			required
			v-model="v$.categoryId.$model"
			:dropdown-class="{ 'p-invalid': v$.categoryId.$invalid && submitted }"
			:errors="v$.categoryId.$errors"
			:show-errors="submitted"
			option-label="name"
			option-value="id"
			:options="categories"
		/>
		<RybPublishedCheckbox
			class="p-fluid"
			v-model="state.published"
			label="Status"
		/>
	</RybSaveWrapperDialog>
</template>
