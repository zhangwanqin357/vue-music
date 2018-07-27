<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(item, index) in dots" :key="index" class="dot" :class="{active: nowIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/javascript">
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default {
  props: {
    loop: { // 循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 自动轮播
      type: Boolean,
      default: true
    },
    interval: { // 轮播间隔时间
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      nowIndex: 0,
      dots: []
    }
  },
  mounted () {
    setTimeout(() => { // 在页面渲染完成之后，为了保证DOM成功渲染，一般加一个延时20ms(浏览器自动刷新周期是17ms)
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        clearTimeout(this.timer)
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => { // 监听resize时间
      if (!this.slider) { // 在slider还没有初始化的时候，什么都不用做
        return
      }

      this._setSliderWidth(true) // 重新计算sliderGroup的宽度
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth (isResize) { // 初始化之前，设置slider的宽度
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth // 父容器slider的宽度
      for (var i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) { // 如果循环轮播的话，需要加2倍的宽度(如果是窗口大小改变的时候，就不加2倍宽度)
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initSlider () { // 初始化slider
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 允许横向滚动
        scrollY: false, // 不允许纵向滚动
        momentum: false, // 惯性
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => { // 监听事件，每当滚动完成的时候触发
        // console.log(this.nowIndex)
        let pageIndex = this.slider.getCurrentPage().pageX - 1
        // console.log(pageIndex)

        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.nowIndex = pageIndex
        // console.log(this.nowIndex)

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })

      // this.slider.on('beforeScrollStart', () => {
      //   if (this.autoPlay) {
      //     clearTimeout(this.timer)
      //   }
      // })
    },
    _play () {
      let pageIndex = this.nowIndex + 2
      // console.log('...', pageIndex)
      // if (this.loop) {
      //   pageIndex += 1
      // }
      // this.nowIndex = pageIndex
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destoryed () { // 页面切换走的时候，进行销毁
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" type="stylesheet.stylus">
  @import '~common/stylus/variable'
  .slider
    // position: relative
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
