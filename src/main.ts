import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'normalize.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

router.isReady().then(() => app.mount('#app'))
