# 工具类

### 遍历根目录下的所有文件

[code](./traverseRootDirFiles.ts)

```typescript
import { createM3u8Download_v1, traversalFolder } from './src'

traversalFolder(async (k) => {
  console.log(k)
  await createM3u8Download_v1(k)
})
```

### 时间戳相互转化

[code](./helper.ts)

```typescript
import { secondsToTime, timeToSeconds } from './src'

console.log(timeToSeconds('00:00:00'))
console.log(timeToSeconds('00:00:01'))
console.log(secondsToTime(0))
console.log(secondsToTime(1))
```

### 生成指定时间戳的截图

`.jpg` 后缀的图片文件大小比较小，但是质量比较差，`.png` 后缀的图片文件大小比较大，但是质量比较好

[code](./screenshot.ts)

```typescript
import { getScreenshot } from './src'

getScreenshot(
  'H:\\resources\\1680\\1680.mp4',
  'H:\\resources\\1680\\screenshots\\post.jpg',
  '00:00:01',
)
```

### 生成指定数量的截图

[code](./screenshot.ts)

```typescript
import { getScreenshots } from './src'

getScreenshots(
  'H:\\resources\\1680\\1680.mp4',
  'H:\\resources\\1680\\screenshots',
  10,
)
```