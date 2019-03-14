// import jsonp from 'common/js/jsonp1'
// import { CommonParams, Options } from './config'
import { param,urlMid,comm } from "./songConfig";
import axios from 'axios'

export function getSongPlay(songlist) {
    const url = 'api/getPurlUrl'
    // {
    //     songmid: ["0047MZMS4Rgs5q"],
    //         songtype: [0]
    // }
    // console.log(obj);
    let obj = filter(songlist)
    const param_a = Object.assign({}, param, obj)
    // urlMid = Object.assign({},urlMid, param )
    urlMid.param = param_a;
    const data = {
        comm,
        urlMid
    }
    return axios.post(url,data).then((res) => {
        return Promise.resolve(res.data)
    })
    // return jsonp(url, data, Options)
}

export function filter(songlist) {
    let songmid = songlist.filter(item => {
        // return item.albumid === item.songid
        return item.albumid && item.songmid
    }).map(obj => {
        return obj.songmid
    })
    let songtype = songmid.map(item => {
        return 0
    })
    return {
        songmid,
        songtype
    }
}