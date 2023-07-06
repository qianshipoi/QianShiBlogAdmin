import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vueI18n from './locale/index'

import './assets/css/style.css'
import 'normalize.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(vueI18n)

router.isReady().then(() => app.mount('#app'))
