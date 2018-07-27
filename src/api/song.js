// import jsonp from 'common/js/jsonp'
import {commonParams} from 'api/config'
import axios from 'axios'

export function getLyric (id) { // 想后端请求歌曲歌词
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    nobase64: 1,
    songtype: 0,
    format: 'json',
    musicid: id
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {
    console.log(error.response)
  })
}

export function getMusicUrl (musicData) { // 获取歌曲信息，从而获取歌曲的vkey
  // const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const url = '/api/getMusicUrl'
  const data = Object.assign({}, commonParams, {
    loginUin: 30515022991,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 3051522991,
    guid: 5931742855,
    songmid: musicData.mid,
    filename: `C400${musicData.mid}.m4a`
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve({
      cid: res.data.cid,
      code: res.data.code,
      userip: res.data.userip,
      data: {
        musicUrl: `http://dl.stream.qqmusic.qq.com/${res.data.data.items[0].filename}?vkey=${res.data.data.items[0].vkey}&guid=5931742855&uin=0&fromtag=38`
      }
    })
  }).catch(function (error) {
    console.log(error.response)
  })
}
