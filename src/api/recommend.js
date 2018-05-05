import jsonp from 'common/js/jsonp1'
import { CommonParams, Options } from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // 传递参数
  const data = Object.assign({}, CommonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, Options)
}