<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playButton" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" ref="list" :data="songs" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40 // 预留高度
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted () { // this.$refs.list.$el获取的是ref对应组件对象的dom
    this.imageHeight = this.$refs.bgImage.clientHeight // 图片高度
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // list滚动的最大高度
    this.$refs.list.$el.style.top = `${this.imageHeight}px` // music-list组件的顶部位置等于背景图的高度大小
  },
  created () {
    this.listenScroll = true
    this.probeType = 3 // 不仅监听滑动，也监听快速滚动
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) { // 点击了某一首歌曲之后被触发的事件
      console.log('点击了这首歌曲：')
      console.log(item)

      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    random () { // 随机播放
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  watch: {
    scrollY (newY) {
      // console.log(this.minTranslateY)
      // console.log(newY)
      let translateY = Math.max(this.minTranslateY, newY) // 选择最大值，因为都是负值，滚动距离很小的时候，translateY = newY,超出顶部的时候，translateY = minTranslateY了，具体可以打印数值观察
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) { // 用户往下拉的时候
        scale = 1 + percent // 图片放大的比例
        zIndex = 10
      } else { // 用户上滑的时候，实现图片模糊
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}}px` // 只有ios设备支持
      if (newY < this.minTranslateY) { // 如果滚动过了边界值
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playButton.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = 0
        this.$refs.playButton.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
              display: inline-block
              vertical-align: middle
              font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0 // 这个值只是一个初始值，因为滚动区的顶部位置由于每个设备的宽度不一样，按照10：7的比例计算而来的图片高度也不一样，所以只能后续通过计算得到高度
      bottom: 0
      width: 100%
      // overflow: hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
