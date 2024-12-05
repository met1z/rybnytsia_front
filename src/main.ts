// styles
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/styles/layout.scss'
import './assets/styles/badges.scss'

import { App, createApp } from 'vue'
import Main from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import {
	BadgeDirective,
	ConfirmationService,
	DialogService,
	Ripple,
	StyleClass,
	ToastService,
} from 'primevue'

let app: App<Element>

app = createApp(Main)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			prefix: 'p',
			darkModeSelector: 'light',
			cssLayer: false,
		},
	},
})

app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

app.directive('ripple', Ripple)
app.directive('badge', BadgeDirective)
app.directive('styleclass', StyleClass)

app.mount('#app')
