// recommend页面
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'
import axios from 'axios'

export function getRecommend () { // 推荐列表banner数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList () { // 获取歌单列表
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {
    console.log(error.response)
  })
}

export function getSongList (disstid) { // 获取某一歌单的歌曲列表
  const url = '/api/disc'
  const data = Object.assign({}, {
    disstid,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {
    console.log(error.response)
  })
}
