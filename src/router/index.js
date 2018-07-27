import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

Vue.use(Router)
// 懒加载组件
const Recommend = () => import('components/recommend/recommend')
const Singer = (resolve) => import('components/singer/singer')
const Rank = (resolve) => import('components/rank/rank')
const Search = (resolve) => import('components/search/search')
const SingerDetail = (resolve) => import('components/singer-detail/singer-detail')
const Disc = (resolve) => import('components/disc/disc')
const TopList = (resolve) => import('components/top-list/top-list')
const UserCenter = (resolve) => import('components/user-center/user-center')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        { // 单个歌单
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        { // 单个歌手
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        { // 单个歌手
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
