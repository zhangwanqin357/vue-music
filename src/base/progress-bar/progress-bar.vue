<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default{
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {} // 新建一个Touch对象
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true // 表示已经初始化
      this.touch.startX = e.touches[0].pageX // 第一次点击的位置的x坐标
      this.touch.left = this.$refs.progress.clientWidth // 触摸时，进度条已经有的宽度
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 移动之后的位置与第一次触摸时位置的偏移量
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect() // 返回一个对象，包含了该元素相对于视口左上角的left,top,right,bottom距离
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 这里当我们点击progressBtn的时候，e.offsetX获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent () { // 设置播放器进度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) { // 监听百分比的变化
      if (newPercent >= 0 && !this.touch.initiated) { // 拖动的时候，不进行此操作
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条的总体宽度
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0,0,0,0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
