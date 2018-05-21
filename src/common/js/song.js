export default class Song{
    constructor({ id, mid, singer, name, album, duration, image, url }){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
}

//生成一首歌曲信息
export function creatSong(songList,songUrl) {
    return new Song({
        id: songList.songid,
        mid: songList.songmid,
        singer: songList.singer[0].name,
        name: songList.songname,
        album: songList.albumname,
        duration: songList.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songList.albummid}.jpg?max_age=2592000`,
        url: songUrl.purl
    })
}