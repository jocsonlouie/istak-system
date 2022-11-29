import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import './registerServiceWorker'
import InstantSearch from 'vue-instantsearch';

Vue.config.productionTip = false
Vue.use(InstantSearch)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
