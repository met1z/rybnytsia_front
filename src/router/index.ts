import {
	createRouter,
	createWebHistory,
	type NavigationGuardNext,
	type RouteLocationNormalized,
} from 'vue-router'

import ForbiddenPage from '../pages/ForbiddenPage.vue'
import HomePage from '../pages/main/MainPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import { useUserStore } from '../stores/user'

declare module 'vue-router' {
	interface RouteMeta {
		title?: string
		requiresAuth?: boolean
		editorAccess?: boolean
		adminAccess?: boolean
	}
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from, savedPosition) {
		return new Promise(resolve => {
			setTimeout(async () => {
				if (savedPosition) {
					resolve(savedPosition)
				}
				const findEl = (hash: string, x = 0) => {
					return (
						document.querySelector(hash) ||
						new Promise(resolve => {
							if (x > 50) {
								return resolve(document.querySelector('body'))
							}
							setTimeout(() => {
								resolve(findEl(hash, ++x || 1))
							}, 100)
						})
					)
				}

				if (to.hash) {
					const el = (await findEl(to.hash)) as HTMLElement
					if ('scrollBehavior' in document.documentElement.style) {
						resolve(window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }))
					} else {
						resolve(window.scrollTo(0, el.offsetTop))
					}
				}
				resolve({ left: 0, top: 0 })
			})
		})
	},
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: () => import('../pages/LoginPage.vue'),
		},
		{
			path: '',
			component: HomePage,
			meta: {
				requiresAuth: true,
			},
			children: [
				{
					meta: { title: 'Users', adminAccess: true },
					name: 'Users',
					path: '/users',
					component: () => import('../pages/main/users/UsersPage.vue'),
				},
				{
					meta: { title: 'Categories', editorAccess: true },
					name: 'Categories',
					path: '/categories',
					component: () => import('../pages/main/categories/CategoriesPage.vue'),
				},
				{
					meta: { title: 'Products', editorAccess: true },
					name: 'Products',
					path: '/products',
					component: () => import('../pages/main/products/ProductsPage.vue'),
				},
			],
		},
		{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
		{ path: '/forbidden', name: 'Forbidden', component: ForbiddenPage },
	],
})

const NavigationGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const nearestWithTitle = to.matched
		.slice()
		.reverse()
		.find(r => r.meta && r.meta.title)

	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title ?? 'Rybnytsia'
	}
	if (to.meta.requiresAuth) {
		const store = useUserStore()
		if (!store.user) {
			next({ name: 'Login' })
			return
		}
		if (!to.meta.editorAccess && !to.meta.adminAccess && (store.editorAccess || store.adminAccess)) {
			next()
			return
		}
		if (to.meta.editorAccess && (store.editorAccess || store.adminAccess))
			next()
		else if (to.meta.adminAccess && store.adminAccess) next()
		else next({ name: 'Forbidden' })
	} else next()
}

router.beforeEach(NavigationGuard)

export default router
