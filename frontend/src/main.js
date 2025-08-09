import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Register a custem directive to focus an element when it is mounted
// This can be used to focus input fields or any other element
// Example usage: <input v-focus>
app.directive('focus', {
    mounted(el) {
        el.focus()
    }
})

app.mount('#app')
