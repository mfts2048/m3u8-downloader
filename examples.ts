// import { createM3u8Download_v1 } from './src'
// createM3u8Download_v1('16924')
//   .catch(console.error)

// import { createM3u8Download_v2 } from './src'
// createM3u8Download_v2('16119')
//   .catch(console.error)

// import { createM3u8Download_v1, traversalFolder } from './src'

// traversalFolder(async (k) => {
//   console.log(k)
//   await createM3u8Download_v1(k)
// })

import { secondsToTime, timeToSeconds } from './src'

console.log(timeToSeconds('00:00:00'))
console.log(timeToSeconds('00:00:01'))
console.log(secondsToTime(0))
console.log(secondsToTime(1))
