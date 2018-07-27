<template>
  <Scroll class="suggest" ref="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </Scroll>
</template>

<script type="text/javascript">
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true, // 需要上拉加载功能
      hasMore: true, // 是否还有更多内容
      beforeScroll: true // 需要监听滚动开始，以用来将input失焦
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    search () { // 搜索关键字
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0) // 每次关键字变化，重新搜索之后，就将scroll滚动到顶部
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          console.log('关键词的搜索结果：')
          console.log(this.result)
          this._checkMore(res.data)
        }
      })
    },
    searchMore () { // 滚动到底部了，需要搜索更多
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data)) // 将新搜索到的结果添加到之前的结果之后
          this._checkMore(res.data)
        }
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) { // 如果是歌手，跳转到歌手详情页
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        }) // 导航到此URL地址，类似于<router-link :to="">,所以也需要<router-view>
        this.setSinger(singer)
      } else { // 如果是歌曲，将歌曲添加到播放列表，并设置为  当前歌曲
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _checkMore (data) { // 每次搜索完成之后，都检测是否展示完，是否还有下一页
      const song = data.song
      console.log(song)
      if (!song.list.length || song.curnum + song.curpage * PERPAGE >= song.totalnum) { // 如果该搜索词的歌曲为0，或者已经展示到最后一页了
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) { // 表示搜索的是歌手关键字
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) { // 加入歌曲列表
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  watch: {
    query () { // query搜索词变化时
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
   @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
