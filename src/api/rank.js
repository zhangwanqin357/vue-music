// rank页面
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'
// import axios from 'axios'

export function getTopList () { // 获取排行榜列表
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getMusicList (topid) { // 获取某一个排行榜的歌曲列表
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  })

  return jsonp(url, data, options)
}
