import { getLyric } from 'api/song'
import {ERR_OK} from 'api/config'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () { // 在歌曲详情里封装歌曲信息
    if (this.lyric) { // 如果歌曲变化时，已经存在了当前歌曲的歌词
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.retcode === ERR_OK) {
          // console.log('歌词数据抓取完成:')
          // console.log(res.lyric)
          // this.lyric = Base64.decode(res.lyric)
          resolve(res.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong (musicData, vkey) { // 格式化歌曲信息
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=20D8689F72843D5DFADB46D549A0497AC4DA4BBE6DE04CD794A1FA82D6CFAFDF70B49A8F25C7B089EF0D9D2622840314653269C7A5CE6650`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    url: ''
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=F9F2AD97A9AE432148526DA3D62777A137D227521DE00F6DBC1EDD3E204EF297D8FBAEEC7072F91DE2AE0213D77ED75AC10236D15569E5D8`
    // 这个音乐源地址可能经常会变动，查看方法：
    // qq音乐网站>>歌手>>随便点击进入一个歌手页面>>打开控制台,手机页面，刷新>>network，清除当前的请求记录>>随意点击一首歌进行播放
    // >>查看当前的所有请求>>查找Type为media的请求>>查看请求url即为音乐源地址
    // 2018-06-01更新：qq音乐网站新增了guid与vkey参数，随机copy一个即可
  })
}

function filterSinger (singer) { // 将singer数组拼接成一个字符串
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
