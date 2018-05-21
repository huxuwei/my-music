function randmNum(min,max) {
    return Math.floor(Math.random() * (max - min +1 ) + min)
}
// 打乱数组顺序
export function random(list) {
    for (let i = 0, leg = list.length; i < leg; i++) {
        let j = randmNum(0,i);
        
        
        [list[i], list[j]] = [list[j], list[i]]
    }
    return list
}