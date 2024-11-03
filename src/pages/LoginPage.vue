<script lang="ts" setup>
	import useVuelidate from '@vuelidate/core'
	import { storeToRefs } from 'pinia'
	import Button from 'primevue/button'
	import Password from 'primevue/password'
	import { useToast } from 'primevue/usetoast'
	import { computed, reactive, ref } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	import { email, helpers, minLength, required } from '@vuelidate/validators'
	import { useLogin } from '../common/composables/useLogin'
	import { ERROR_MESSAGE } from '../common/constants'
	import RybFieldError from '../components/generic/RybFieldError.vue'
	import RybInput from '../components/generic/RybInput.vue'
	import { useUserStore } from '../stores/user'

	const rules = {
		email: {
			required: helpers.withMessage(`Email is required`, required),
			email: helpers.withMessage(`Email is not a valid email address`, email),
		},
		password: {
			required: helpers.withMessage(`Password is required`, required),
			minLengthValue: helpers.withParams(
				{
					detailedErrorMessage: `The minimum allowed Password length is 8`,
				},
				minLength(8)
			),
		},
	}

	const state = reactive({
		email: '',
		password: '',
	})
	const submitted = ref(false)

	const loading = ref(false)

	const v$ = useVuelidate(rules, state)
	const router = useRouter()
	const toast = useToast()
	const service = useLogin()
	const store = useUserStore()
	const { token } = storeToRefs(store)

	const route = useRoute()
	const locationPush = computed(() => {
		if (
			route.redirectedFrom &&
			route.redirectedFrom.name !== 'Login' &&
			route.redirectedFrom.path != '/'
		)
			return route.redirectedFrom
		else return { path: '/' }
	})

	const authAdmin = async () => {
		submitted.value = true
		if (v$.value.email.$invalid || v$.value.password.$invalid) {
			const detail = v$.value.$errors
				.map(
					item =>
						(item.$params as Record<string, string>).detailedErrorMessage ??
						item.$message.toString()
				)
				.join(', ')
			return toast.add(ERROR_MESSAGE(detail))
		}
		if (token.value) return router.push(locationPush.value)
		try {
			loading.value = true
			await service.login(state.email, state.password)
			console.log(locationPush.value)
			router.push(locationPush.value)
		} finally {
			loading.value = false
		}
	}
</script>

<template>
	<div
		class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
	>
		<div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
			<div
				class="col-12 xl:col-6"
				style="
					border-radius: 56px;
					padding: 0.3rem;
					background: linear-gradient(
						180deg,
						var(--primary-color),
						rgba(33, 150, 243, 0) 30%
					);
				"
			>
				<div
					class="h-full w-full m-0 py-7 px-4"
					style="
						border-radius: 53px;
						background: linear-gradient(
							180deg,
							var(--surface-50) 38.9%,
							var(--surface-0)
						);
					"
				>
					<div class="flex flex-column align-items-center mb-5">
						<img src="/logo.png" alt="ryb logo" width="130" class="mb-4" />
						<span class="text-600">Sign in to continue</span>
					</div>

					<form @submit.prevent="authAdmin" class="w-full md:w-10 mx-auto">
						<ryb-input
							class="p-fluid"
							label="Email"
							required
							v-model="v$.email.$model"
							:input-class="{ 'p-invalid': v$.email.$invalid && submitted }"
							:errors="v$.email.$errors"
							:show-errors="submitted"
							:autofocus="true"
							input-style="padding: 1rem"
						/>
						<div class="field mb-3">
							<label for="password" class="field-title">Password *</label>
							<Password
								id="password"
								v-model="v$.password.$model"
								placeholder="Password"
								:toggleMask="true"
								class="w-full"
								inputClass="w-full"
								:inputStyle="{ padding: '1rem' }"
								aria-describedby="password-error"
								autocomplete="current-password"
								type="password"
							></Password>
							<ryb-field-error
								v-if="v$.password.$error && submitted"
								:errors="v$.password.$errors"
								replace-error-name="Password"
							/>
						</div>

						<Button
							:icon="loading ? 'pi pi-spin pi-spinner' : undefined"
							:disabled="loading"
							type="submit"
							label="Submit"
							class="w-full p-3 text-xl"
						/>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.pi-eye {
		transform: scale(1.6);
		margin-right: 1rem;
	}
	.pi-eye-slash {
		transform: scale(1.6);
		margin-right: 1rem;
	}
</style>
