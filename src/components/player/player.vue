<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="playground">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="index">{{ line.txt }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/javascript">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import { getMusicUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import Playlist from 'components/playlist/playlist'
import { playerMixin } from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null, // 当前播放的歌词
      currentLineNum: 0, // 当前歌词所在的行
      currentShow: 'cd',
      playingLyric: '' // 当前播放的一行的歌词内容
    }
  },
  computed: {
    playIcon () { // 播放按钮的类
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () { // 歌曲资源没准备好时，将上一首/播放/下一首三个按钮置为不可用状态
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created () {
    this.touch = {} // 新建一个Touch对象
  },
  methods: {
    showPlaylist () {
      this.$refs.playlist.show()
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = { // 定义动画
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({ // 注册动画
        name: 'move', // 动画名称
        animation, // 动画
        presets: { // 预设
          duration: 400, // 动画间隔
          easing: 'linear' // 缓动
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done) // 运行动画,el就是需要动画的对象,done执行之后会跳转到afterEnter钩子
    },
    afterEnter (el) {
      animations.unregisterAnimation('move') // 动画执行完之后
      this.$refs.cdWrapper.style.animation = '' // 清空动画
    },
    leave (el, done) { // 离开的时候，不需要使用animation放大再变小的动画效果，就直接设置transform
      this.$refs.cdWrapper.style.transition = `all 0.4s`
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done) // 监听过渡效果结束了之后，就执行done
    },
    afterLeave (el) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    togglePlaying () { // 切换歌曲的播放/暂停状态
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end () { // 歌曲播放完成
      if (this.mode === playMode.loop) { // 如果播放状态是单曲循环
        this.loop()
      } else {
        this.next() // 切换到下一首
      }
    },
    loop () { // 单曲循环执行的操作就是将歌曲播放进度置为0
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) { // 循环播放时，歌曲结束时歌词需要重新开始
        this.currentLyric.seek(0)
      }
    },
    prev () { // 上一首
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) { // 如果点击上一首时，歌曲为暂停状态，就将歌曲切换为播放状态
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next () { // 下一首
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return // 如果播放列表只有一首歌，在点击下一首的时候，歌曲进行循环，但此时，@play事件不会再一次触发，也就是return,不设置songReady为false即可
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) { // 如果点击下一首时，歌曲为暂停状态，就将歌曲切换为播放状态
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
      // 在歌曲ready之后，将歌曲添加到播放列表中
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    updateTime (e) { // 当播放位置改变时触发
      // console.log(e)
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0 // 向下取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBarChange (percent) { // 拖动进度条，改变当前播放的currentTime
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) { // 如果在拖动的时候，播放器是暂停状态，那么就切换状态
        this.togglePlaying()
      }
      if (this.currentLyric) { // currentTime单位s,seek()方法参数单位ms
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => { // 进行歌曲解析
        lyric = lyric.replace(/&#(\d+);/g, (str, match) => String.fromCharCode(match)) // 将歌词里的Unicode编码替换
        // console.log(lyric) // 打印出正常版本的歌词
        if (this.currentSong.lyric !== lyric) { // 在快速切换的时候，如果当前正在播放的歌曲与请求回来的歌词不一致
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        console.log(this.currentLyric) // 解析后的歌词
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true // 表示已经初始化
      const touch = e.touches[0]
      this.touch.startX = touch.pageX // 第一次点击的位置的x坐标
      this.touch.startY = touch.pageY // 第一次点击的位置的y坐标
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { // 如果y轴偏移大于x轴便宜，不作处理
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth // 歌词页面左边的位置
      const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX), 0) // 歌词页面出现的宽度
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      this.touch.initiated = false
      let offsetWidth, opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    _play () {
      setTimeout(() => {
        this.getLyric()
        this.$refs.audio.play()
      }, 20)
    },
    _pad (num, n = 2) { // num-传入的数字，n-需要补到第几位
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale () { // 获取两个大小图片的初始位置以及缩放比例
      // 小图片
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      // 大图片
      const paddingTop = 80
      const width = window.innerWidth * 0.8 // 大图标的宽度
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    _musicPlay () {
      if (!this.currentSong.url) {
        getMusicUrl(this.currentSong).then((res) => {
          if (res.code === ERR_OK) {
            this.setMusicUrl(res.data.musicUrl)
            this._play()
          }
        })
      } else {
        this.$refs.audio.play()
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setMusicUrl: 'SET_MUSIC_URL',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) { // 当currentSong变化的时候，执行play方法.
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) { // 在暂停状态下，切换播放模式的时候，因为改变了playList,currentIndex,也就导致currentSong实际上是会有变化的，所以这个watch会被触发。如此，通过监听新旧歌曲是否一样来确定是否触发这个watch
        return
      }
      if (this.currentLyric) { // 由于每次切换歌曲时，重新getLyric()，而导致每次都new Lyric(),但是前一个歌词的计数器没有清除，会导致切换歌曲的时候歌词不停的跳动。所以需要在切换歌曲获取歌词之前，先0进行清除
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer) // 快速切换的时候
      this.timer = setTimeout(() => { // 不适用this.nextTick(),如果在微信里面播放，后续的js是不能执行的，但是当前的歌曲可以播放完成
        // this.$refs.audio.play()
        // this.getLyric() // 监听歌曲的状态，并获取歌词
        this._musicPlay()
      }, 1000)
    },
    playing (newPlaying) { // 监听playing这个值的状态，控制播放/暂停
      console.log(newPlaying)
      const audio = this.$refs.audio
      if (!this.currentSong.url) return
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .playground
        position: absolute
        left: 0
        right: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-active
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 60px
      z-index: 180
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-active
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          position: absolute
          top: 0
          left: 0
          font-size: 32px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
