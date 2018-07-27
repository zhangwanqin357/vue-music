import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
  singer: {}, // 单个歌手信息
  playing: false, // 播放状态（播放/暂停）
  fullScreen: false, // 播放器状态（展开/收起）
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式,默认顺序播放
  currentIndex: -1, // 当前播放索引
  disc: {}, // 单个歌单信息，与singer类似
  topList: {}, // 排行榜
  searchHistory: loadSearch(), // 搜索历史,不设置为空的原因：搜索历史永远都应该从本地存储中获取
  playHistory: loadPlay(), // 播放历史列表
  favoriteList: loadFavorite() // 用户收藏列表
}

export default state
