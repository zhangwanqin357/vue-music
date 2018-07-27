import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYLIST, list) // 设置播放列表
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_SEQUENCE_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_SEQUENCE_LIST, list) // 设置顺序播放列表
  }
  commit(types.SET_CURRENT_INDEX, index) // 设置当前播放歌曲的索引
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
}

export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 在当前的播放列表中，查找是否含有需要插入的这首歌，并返回其索引
  // 插入之前就需要进行判断
  let fpIndex = findIndex(playList, song)
  // 在当前歌曲的后面插入一首歌，所以currentIndex要加一
  currentIndex++
  // 插入
  playList.splice(currentIndex, 0, song)
  if (fpIndex > -1) { // 插入之前已经包含了这首歌
    // 如果当前插入的位置，大于原歌曲位置
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  // 在sequenceList中查找currentSong的索引
  // +1 即为在sequenceList中需要插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 插入之前是否有这首歌曲
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const saveSearchHistory = function ({ commit }, query) { // 保存搜索结果
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) { // 删除某一搜索历史
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) { // 清空搜索历史
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}

export const savePlayHistory = function ({ commit }, song) { // 将某一歌曲保存进播放历史列表
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({ commit }, song) { // 收藏一首歌曲
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
