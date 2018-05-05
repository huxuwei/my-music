import originJSONP from 'jsonp'

// 将jsonp封装成promise
export default function (url, data, option) {
  // 如果url没有?加上?, 如果有说明有参数了，所以加&
  url += (url.indexOf('?') < 0 ? '?' : '&') + joinUrl(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 将参数拼接起来
export function joinUrl(data) {
  let url = ''
  for (const key in data) {
    url += `&${key}=${encodeURIComponent(data[key])}`
  }
  // 如果有参数,将第一个$去掉
  return url ? url.substring(1) : ''
}