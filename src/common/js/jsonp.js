/*
 将原始的jsonp封装成一个Promise方法
  url: 服务器地址
  data: 参数
  option: 回调函数
*/
import originJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data) // 将URL与data拼接在一起

  return new Promise((resolve, reject) => {
    // 原始的jsonp中，url:服务器地址+参数；option:回调函数；第三个参数就是jsonp的回调函数
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
