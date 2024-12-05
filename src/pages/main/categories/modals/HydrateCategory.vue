<script lang="ts" setup>
	import useVuelidate from '@vuelidate/core'
	import { cloneDeep } from 'lodash'
	import { computed, ref, toRefs, watch } from 'vue'

	import { useModal } from '../../../../common/composables/useModal'
	import { rybName } from '../../../../common/validators/ryb-name-validator'
	import { rybRequired } from '../../../../common/validators/ryb-required.validator'
	import RybSaveWrapperDialog from '../../../../components/generic/RybSaveWrapperDialog.vue'
	import RybInput from '../../../../components/generic/RybInput.vue'
	import RybFileUpload from '../../../../components/generic/RybFileUpload.vue'
	import { CreateCategoryModal } from '../interfaces/create-category-modal.interface'
	import { UpdateCategory } from '../interfaces/update-category.interface'
	import { UpdateCategoryModal } from '../interfaces/update-category-modal.interface'
	import RybPublishedCheckbox from '../../../../components/generic/RybPublishedCheckbox.vue'

	const emit = defineEmits<{
		(e: 'close'): void
		(e: 'save', payload: CreateCategoryModal): void
	}>()
	const props = defineProps<{
		options: { isCreated?: boolean; header: string }
		dialog: boolean
		loading: boolean
		data?: UpdateCategory
	}>()
	const { dialog } = toRefs(props)

	const show = computed({ get: () => props.dialog, set: () => emit('close') })

	const stateInitial = {
		name: undefined,
		imageFile: undefined,
		published: false,
	}

	const state = ref<UpdateCategoryModal>({ ...stateInitial })
	const rules = computed(() => {
		const alwaysExisted = {
			name: rybName(),
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

		emit('save', state.value as unknown as CreateCategoryModal)
	}

	const fileImageChange = (f: File | undefined) => {
		state.value.imageFile = f
	}

	watch(dialog, () => {
		state.value = cloneDeep({
			...stateInitial,
			...props.data,
		})
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
		<RybPublishedCheckbox
			class="p-fluid"
			v-model="state.published"
			label="Status"
		/>
	</RybSaveWrapperDialog>
</template>
