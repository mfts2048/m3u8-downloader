/**
 * 使用 ffmpeg 指令下载 m3u8 视频
 */
import { exec } from 'node:child_process'
import { create } from './create'

export async function createM3u8Download_v2(uid: string) {
  const { _ctx, fileContent_json } = await create(uid)

  fileContent_json._url = fileContent_json._url.replace('newindex.m3u8', 'index.m3u8')

  return new Promise<void>((resolve, reject) => {
    const cmd = `ffmpeg -i ${fileContent_json._url} ${_ctx.filepath_mp4}`
    exec(cmd, (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      console.log(stdout)
      console.log(stderr)
      resolve()
    })
  })
}
