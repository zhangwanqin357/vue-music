<template>
  <div class="recommend-component" ref="recommond">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommendSliders.length" class="slider-wrapper">
          <slider>
            <!-- 在页面created的时候，recommendSliders是被异步加载，数据有可能有延迟，但是此时，mounted有可能已经被执行了，但是此时slider是没有接收到数据的也就是说slot里面是没有内容的，所以就需要确保recommendSliders已经获取到了，再来渲染slider组件的内容-->
            <div v-for="item in recommendSliders" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.dissid" class="item" @click="selectDisc(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{ item.creator.name }}</h2>
                <p class="desc">{{ item.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommendSliders: {}, // banner数据
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommond.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectDisc (disc) { // 点击选中某一歌单
      // console.log('点击选中了这个歌单：')
      // console.log(disc)
      this.$router.push({
        path: `/recommend/${disc.dissid}`
      })
      this.setDisc(disc)
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.recommendSliders = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          this.discList = res.data.list
        }
      })
    },
    loadImage () {
      if (!this.checkLoaded) { // 图片加载后，只执行一次刷新
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .recommend-component
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      position: relative
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
