// search页面
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'
import axios from 'axios'

export function getHotKey () { // 获取热门搜索列表
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

/*
* query = 检索词
* page = 检索第几页
* zhida = 是否展示歌手数据
* perpage = 每次搜索展示多少条数据
*/
export function search (query, page, zhida, perpage) { // 搜索关键字、歌手
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = '/api/search'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    t: 0,
    flag: 1,
    zhidaqu: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    perpage,
    n: perpage
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {
    console.log(error.response)
  })

  // return jsonp(url, data, options)
}
