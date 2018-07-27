<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      songs: [],
      vkey: ''
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([ // 得到的是计算属性singer，通过this.singer使用
      'singer' // 对应getters中的singer
    ])
  },
  created () {
    console.log('当前选择的歌手是：', this.singer.name)
    console.log(this.singer)
    this._getDetail()
  },
  components: {
    MusicList
  },
  methods: {
    _getDetail () { // 获取歌手的详情信息
      let singerID = this.singer.id
      if (!singerID) {
        this.$router.push({path: '/singer'})
        return
      }
      getSingerDetail(singerID).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
          // 打印歌手的100首歌曲
          console.log('当前歌手的100首歌曲:')
          console.log(this.songs) // 此时，验证音乐外链图片与音乐源等等，可能出现403 forbidden，可能是qq音乐更改了域名或者是什么情况
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-active
    transform: translate3d(100%, 0, 0)
</style>
