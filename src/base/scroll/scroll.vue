<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
import BScroll from 'better-scroll'

export default{
  props: {
    probeType: { // 值：0，1，2，3分别表示何时派发scroll时间
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: { // 传入的数据
      type: Array,
      default: null
    },
    listenScroll: { // 设置scroll组件是否监听滚动事件
      type: Boolean,
      default: false
    },
    pullup: { // 是否支持上拉刷新的功能
      type: Boolean,
      default: false
    },
    beforeScroll: { // 是否监听滚动开始，触发beforeScrollStart事件
      type: Boolean,
      default: false
    },
    refreshDelay: { // 指定在传入的数据变化后，多少ms之后进行重新计算
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) { // 如果设置了监听滚动事件，就在scroll实例上面监听scroll事件，并派发出去
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }

      if (this.pullup) { // 如果pullup为true,需要上拉刷新
        this.scroll.on('scrollEnd', () => { // scrollEnd,当'滚动结束'时触发
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) { // 快滚动到底部,派发事件
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => { // 滚动开始之前触发
          this.$emit('beforeScroll')
        })
      }
    },
    enable () { // 启用 better-scroll
      this.scroll && this.scroll.enbale()
    },
    disable () { // 禁用 better-scroll
      this.scroll && this.scroll.disable()
    },
    refresh () { // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () { // 滚动到指定元素
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () { // 只要data变化就刷新，此种监听方式就不需要调用方去直接调用scroll实例的方法，以此将组件与better-scroll独立出来
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
