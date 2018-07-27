import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger' // 每次通过mutation修改state的时候，都会在控制台打印出state修改状态

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 开发环境or发布环境

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
