<script lang="ts" setup>
	import RybLogoImage from '../assets/logo.png'

	import RybPhoto from '../components/generic/RybPhoto.vue'
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
					<div class="grid flex flex-column align-items-center">
						<div class="flex flex-column align-items-center">
							<ryb-photo
								:image-url="RybLogoImage"
								class="mb-4"
								:aspect-ratio="12 / 37"
								dominant-color="transparent"
								alt="ryb logo"
								style="width: 130px"
							/>
						</div>
						<h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">
							Access Denied
						</h1>
						<span class="text-600 text-center"
							>You do not have the necesary permisions. Please contact
							admins.</span
						>
						<div style="width: 80%" class="mt-5">
							<ryb-photo
								image-url="asset-access.svg"
								:aspect-ratio="79 / 110"
								dominant-color="transparent"
								alt="Access denied"
							/>
						</div>
						<div class="col-12 mt-5 text-center">
							<i
								class="pi pi-fw pi-arrow-left text-blue-500 mr-2"
								style="vertical-align: center"
							></i>
							<router-link to="/login" class="text-blue-500"
								>Go to Login</router-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
