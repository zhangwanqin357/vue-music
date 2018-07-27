<template>
  <scroll class="listview" ref="listview" :data="data" :listen-scroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="(item, index) in group.items" :key="index" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母索引部分；touchstart事件：HTML5触摸事件 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" class="item" :class="{'current':currentIndex===index}">{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixedTop">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 每个锚点的高度
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: function () { // Array与Object类型时，默认值必须通过函数返回
        return []
      }
    }
  },
  created () {
    this.touch = {} // 在data里的数据一般用于数据绑定及观测，但是touch相关的数据只需要记录，不需要观测
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3 // 不仅监听滑动，也监听快速滚动
  },
  computed: {
    shortcutList () { // 字母索引集合
      return this.data.map((group) => {
        return group.title.substr(0, 1) // substr()提取从指定位置，指定长度的字符。此处就是‘热门’两个字取‘热’
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    data () { // 检测data数据的变化，延时计算每个组的高度
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) { // newY代表当前scrollY值
      // console.log(newY)
      const listHeight = this.listHeight
      // 当滚动到顶部(鼠标仍然将页面下拉)，newY>0
      if (newY > 0) {
        this.currentIndex = 0
      }
      // 在中间部分滚动，newY一直是负值
      for (var i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTop.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  methods: {
    selectItem (item) { // 点击某一个歌手，派发事件
      this.$emit('select', item)
    },
    onShortcutTouchStart (e) { // 触摸屏幕，跳转到指定的字母索引位置
      let anchorIndex = getData(e.target, 'index') // 获得当前点击元素的data-index属性值，在这里就是当前的index
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY // 记录touchstart时的y值
      this.touch.anchorIndex = anchorIndex // 字符串类型
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY // 记录touchmove时的y值
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 向下取整，类似Math.floor()
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) { // 点击侧边条空白部分
        return
      }
      if (index < 0) { // 触摸滑动到最上方还在继续滑动时，index变为了负值
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      // console.log('每个group对应的高度集合：', this.listHeight)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
