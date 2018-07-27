<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/javascript">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
// import { getSongVkey } from 'api/singer'
import { ERR_OK } from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    console.log('当前选择的歌单是：', this.disc.dissname)
    // console.log(this.disc)
    this._getDisc()
  },
  components: {
    MusicList
  },
  methods: {
    _getDisc () { // 获取歌单详情信息
      let discID = this.disc.dissid
      if (!discID) {
        this.$router.push({
          path: '/recommend'
        })
        return
      }
      getSongList(discID).then((res) => {
        // console.log(res.cdlist[0].songlist)
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        if (item.id && item.album.id) {
          let musicData = {
            songid: item.id,
            songmid: item.mid,
            singer: item.singer,
            songname: item.name,
            albumname: item.album.name,
            interval: item.interval,
            albummid: item.album.mid
          }
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
