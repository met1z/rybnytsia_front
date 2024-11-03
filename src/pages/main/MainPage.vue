<script setup lang="ts">
	import { usePrimeVue } from 'primevue/config'
	import { computed, ref } from 'vue'
	import { RouterView } from 'vue-router'

	import AppHeader from '../../components/navigation/app-header.vue'
	import AppSidebar from '../../components/navigation/app-sidebar.vue'
	import { SidebarItem } from '../../common/interfaces/sidebar-item.interface'
	import { useUserStore } from '../../stores/user'

	const primevue = usePrimeVue()

	const userStore = useUserStore()
	const menuClick = ref(false)
	const layoutMode = ref('static')
	const mobileMenuActive = ref(false)
	const overlayMenuActive = ref(false)
	const staticMenuInactive = ref(false)
	const menu = computed<SidebarItem[]>(() => {
		const contentItems = {
			label: 'Application',
			items: [
				{
					label: 'Products',
					icon: 'mdi mdi-car',
					to: '/products',
				},
				{
					label: 'Categories',
					icon: 'mdi mdi-home-outline',
					to: '/categories',
				},
			],
		}
		const moderationItems = {
			label: 'Moderation',
			items: [
				{
					label: 'Users',
					icon: 'mdi mdi-account-group-outline',
					to: '/users',
				},
			],
		}

		if (userStore.adminAccess) return [contentItems, moderationItems]
		else if (userStore.editorAccess) return [contentItems]
		else return []
	})

	const containerClass = computed(() => {
		return [
			'layout-wrapper',
			{
				'layout-overlay': layoutMode.value === 'overlay',
				'layout-static': layoutMode.value === 'static',
				'layout-static-sidebar-inactive':
					staticMenuInactive.value && layoutMode.value === 'static',
				'layout-overlay-sidebar-active':
					overlayMenuActive.value && layoutMode.value === 'overlay',
				'layout-mobile-sidebar-active': mobileMenuActive.value,
				'p-input-filled': primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': primevue.config.ripple === false,
			},
		]
	})

	const isDesktop = () => window.innerWidth >= 992

	const onSidebarClick = () => {
		menuClick.value = true
	}

	const onMenuItemClick = (item: SidebarItem) => {
		if (item) {
			overlayMenuActive.value = false
			mobileMenuActive.value = false
		}
	}

	const onMenuToggle = () => {
		menuClick.value = true

		if (isDesktop()) {
			if (layoutMode.value === 'overlay') {
				if (mobileMenuActive.value === true) {
					overlayMenuActive.value = true
				}

				overlayMenuActive.value = !overlayMenuActive.value
				mobileMenuActive.value = false
			} else if (layoutMode.value === 'static') {
				staticMenuInactive.value = !staticMenuInactive.value
			}
		} else {
			mobileMenuActive.value = !mobileMenuActive.value
		}
	}

	const onWrapperClick = () => {
		if (!menuClick.value) {
			overlayMenuActive.value = false
			mobileMenuActive.value = false
		}

		menuClick.value = false
	}
</script>

<template>
	<div :class="containerClass" @click="onWrapperClick">
		<app-header @menu-toggle="onMenuToggle" />
		<div class="layout-sidebar" @click="onSidebarClick">
			<app-sidebar
				:root="true"
				:items="menu"
				@menuitem-click="onMenuItemClick"
			/>
		</div>

		<div class="layout-main-container">
			<div class="layout-main">
				<router-view />
			</div>
		</div>

		<transition name="layout-mask">
			<div
				class="layout-mask p-component-overlay"
				v-if="mobileMenuActive"
			></div>
		</transition>
	</div>
</template>
