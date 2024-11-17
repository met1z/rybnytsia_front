<script lang="ts" setup>
	import useVuelidate from '@vuelidate/core'
	import { cloneDeep, upperFirst } from 'lodash'
	import { computed, nextTick, ref, toRefs, watch } from 'vue'

	import { useModal } from '../../../../common/composables/useModal'
	import { User } from '../../../../common/interfaces/user.interface'
	import { rybName } from '../../../../common/validators/ryb-name-validator'
	import { rybRequired } from '../../../../common/validators/ryb-required.validator'
	import RybSaveWrapperDialog from '../../../../components/generic/RybSaveWrapperDialog.vue'
	import { CreateUser } from '../interfaces/create-user.interface'
	import { rybEmail } from '../../../../common/validators/ryb-email.validator'
	import { rybMinLength } from '../../../../common/validators/ryb-min-length.validator'
	import RybInput from '../../../../components/generic/RybInput.vue'
	import { UserRoles } from '../../../../common/enums/user-roles.enum'
	import RybDropdown from '../../../../components/generic/RybDropdown.vue'

	const roles = [
		{
			label: upperFirst(UserRoles.EDITOR),
			value: UserRoles.EDITOR,
		},
		{
			label: upperFirst(UserRoles.ADMIN),
			value: UserRoles.ADMIN,
		},
	]

	const emit = defineEmits<{
		(e: 'close'): void
		(e: 'save', payload: CreateUser): void
		(e: 'search', query?: string): void
		(e: 'search-questionnaire', query?: string): void
	}>()
	const props = defineProps<{
		options: { isCreated?: boolean; header: string }
		dialog: boolean
		loading: boolean
		data?: Pick<User, 'email' | 'username'>
	}>()
	const { dialog } = toRefs(props)

	const show = computed({ get: () => props.dialog, set: () => emit('close') })

	const stateInitial = {
		username: undefined,
		password: undefined,
		role: undefined,
		email: undefined,
	}

	const state = ref({ ...stateInitial })
	const rules = computed(() => {
		const alwaysExisted = {
			username: rybName(),
			email: { required: rybRequired('Email'), email: rybEmail() },
		}
		return props.options.isCreated
			? {
					...alwaysExisted,
					password: {
						required: rybRequired('Password'),
						minLengthValue: rybMinLength('Password', 8),
					},
					role: { required: rybRequired('Role') },
			  }
			: alwaysExisted
	})
	const v$ = useVuelidate(rules, state)
	const { validateModal, afterHide, submitted } = useModal(v$, state)

	const save = async () => {
		const isValid = await validateModal()
		if (!isValid) return

		emit('save', state.value as unknown as CreateUser)
	}

	watch(dialog, async () => {
		state.value = cloneDeep({
			...stateInitial,
			...props.data,
		})
		await nextTick()
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
		<RybInput
			class="p-fluid"
			label="Username"
			required
			v-model="v$.username.$model"
			:max-length="v$.username.maxLengthValue.$params.max"
			:input-class="{ 'p-invalid': v$.username.$invalid && submitted }"
			:errors="v$.username.$errors"
			:show-errors="submitted"
			:autofocus="true"
		/>
		<RybInput
			class="p-fluid"
			label="Email"
			required
			v-model="v$.email.$model"
			:input-class="{ 'p-invalid': v$.email.$invalid && submitted }"
			:errors="v$.email.$errors"
			:show-errors="submitted"
		/>
		<RybDropdown
			class="p-fluid"
			required
			v-model="v$.role.$model"
			:dropdown-class="{ 'p-invalid': v$.role.$invalid && submitted }"
			:errors="v$.role.$errors"
			:show-errors="submitted"
			label="Role"
			:options="roles"
			option-label="label"
			option-value="value"
		/>
		<RybInput
			class="p-fluid"
			label="Password"
			required
			v-model="v$.password.$model"
			:min-length="v$.password.minLengthValue.$params.max"
			:input-class="{ 'p-invalid': v$.password.$invalid && submitted }"
			:errors="v$.password.$errors"
			:show-errors="submitted"
			:autofocus="true"
		/>
	</RybSaveWrapperDialog>
</template>
