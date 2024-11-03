<script lang="ts" setup>
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
	import { useUserStore } from '../../stores/user'

	const router = useRouter()
	const route = useRoute()
	const store = useUserStore()
	const { user } = storeToRefs(store)

	const emit = defineEmits<{
		(e: 'menu-toggle'): void
	}>()

	const onMenuToggle = () => {
		emit('menu-toggle')
	}
	const logout = () => {
		store.$reset()
		router.push({ name: 'Login' })
	}
</script>
<template>
	<div class="layout-topbar">
		<div class="logo">
			<img src="/logo.png" alt="ryb logo" />
		</div>
		<button
			class="p-link layout-menu-button layout-topbar-button"
			@click="onMenuToggle"
		>
			<i class="pi pi-bars"></i>
		</button>
		<div class="current-page">{{ route.meta.title }}</div>
		<div v-if="user" class="ryb-menu ml-auto">
			<span>{{ user.username }}</span>
			<i class="mdi mdi-account-box"></i>
		</div>
		<div v-if="user" class="ryb-menu ryb-menu-logout ml-3" @click="logout">
			<div class="icon">
				<i class="mdi mdi-logout"></i>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.logo {
		display: flex;
		width: 300px;
		margin: 0 1rem;

		img {
			width: 70px;
		}

		@media (max-width: 991px) {
			width: 100px;

			img {
				width: 50px;
			}
		}
	}

	.current-page {
		display: flex;
		font-size: 1.75rem;
		font-weight: 500;
		margin: 0 1rem;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.ryb-menu {
		display: flex;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
		padding: 0.25rem 1rem;
		align-items: center;

		i {
			font-size: 2rem;
		}

		span {
			margin-right: 1rem;
		}
	}

	.ryb-menu-logout {
		cursor: pointer;

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 33px;
			i {
				font-size: 1.5rem;
			}
		}
	}
</style>
