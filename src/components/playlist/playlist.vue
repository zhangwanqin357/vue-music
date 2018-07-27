<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listItem" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/javascript">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { playerMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ])
  },
  methods: {
    getCurrentIcon (item) { // 当前歌曲如果与currentSong匹配，就返回current的标签样式
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) { // 随机播放
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) { // 保证当前歌曲永远显示在最上面
      const index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playList.length) { // 如果列表已经删除完了，就隐藏
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    show () {
      this.showFlag = true
      setTimeout(() => { // 由显示到隐藏进行切换时，必须要重新计算better-scroll才能够重新计算dom。否则，最开始切换成显示状态时，better-scroll不能滚动
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    close () {
      this.hide()
      this.$emit('close')
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong === oldSong) { // 如果当前组件不显示，或者歌曲没有变化，就不滚动
        return
      }
      this.scrollToCurrent(newSong) // scroll滚动到新歌曲
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .playlist
    position: fixed
    left: 0
    right: 0
    bottom: 0
    top: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-active
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.3s
          &.list-enter, &.list-leave-active
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
