import componentvuenut from './src/components/vuenut.vue'
import './src/css/iconfont/material-icons.css'

const Vuenut = {
  install(Vue, options) {
    Vue.component(componentvuenut.name,componentvuenut)

    Vue.prototype.$vn = {}

  }


}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuenut)

}
// Vuesax.version = '__VERSION__'

export default Vuenut
