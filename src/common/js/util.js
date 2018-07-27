function getRandomInt (min, max) { // 随机获取一个整数，包含max
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) { // 洗牌函数，将一个数组打乱
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/* 如果函数之前被调用过，就会有timer的存在，此时就清空timer
timer被清空之后，再添加一个timer
由此，无论函数被调用多少次，都只会执行一次次函数,
此方法用于在input输入框中，用户每次输入都会请求过于消耗流量的情况使用
*/
export function debounce (func, delay) { // 节流函数，将函数进行延时
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
