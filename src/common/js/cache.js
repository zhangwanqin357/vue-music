// 不直接操作localstorage，good-storage封装了localstorage与sessionStorage
import storage from 'good-storage'

// 存储搜索的key
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
// 存储播放历史的key
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200
// 存储收藏歌曲的key
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

/*
* 向数组最前面插入值
* arr = 数组
* val = 需要插入的值
* compare = 比较函数
* maxLen = 最大值
* 插入值始终在数组第一个
*/
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) { // 数组中已经有这条数组，且在第一位
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// start 搜索历史记录保存
export function saveSearch (query) { // 将当前的搜索关键字，插入到历史列表中，保存并返回新的搜索关键字数组
  // 当前存储空间中的值
  let searches = storage.get(SEARCH_KEY, [])
  // 向searches中插入query
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  // 设置storage
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch (query) { // 从数组中删除某一个关键字
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () { // 清楚搜索历史
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch () { // 本地存储中的search数据
  return storage.get(SEARCH_KEY, [])
}
// end 搜索历史记录保存
// start 播放历史记录保存
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}
// end 播放历史记录保存
// start 收藏歌曲记录保存
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
// end 收藏歌曲记录保存
