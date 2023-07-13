import path from 'node:path'
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import type { CipherCCMTypes } from 'node:crypto'
import crypto, { createDecipheriv } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { PromisePool } from '@supercharge/promise-pool'
import download from 'download'
import ProgressBar from 'progress'

import { createContext } from './init'

export async function createM3u8Download_v1(uid: string) {
  console.log('服务初始化中...')
  console.time('服务初始化耗时')
  const _ctx = await createContext(uid)
  console.log('服务初始化结束')
  console.timeEnd('服务初始化耗时')

  const bar = new ProgressBar('[:bar] :current/:total :percent :etas', {
    total: _ctx.segments.length,
    width: 20,
  })

  console.log('文件下载中...')
  console.time('文件下载耗时')
  const { errors, results } = await PromisePool
    .for(_ctx.segments)
    .withConcurrency(_ctx.concurrency)
    .useCorrespondingResults()
    .onTaskFinished(() => bar.tick())
    .process(async (segment) => {
      const filename = path.parse(segment.uri).name
      const filepath = path.join(_ctx.folder, `${filename}.ts`)

      if (existsSync(filepath)) return filepath

      try {
        const stream = await download(segment.uri)
        const iv = crypto.randomBytes(16)
        const algorithm: CipherCCMTypes = `${segment.key.method}-cbc`.toLowerCase() as CipherCCMTypes
        const cipher = createDecipheriv(algorithm, _ctx.aes, iv)
        cipher.on('error', console.error)
        const segmentData = Buffer.concat([cipher.update(stream), cipher.final()])

        await writeFile(filepath, segmentData)
        return filepath
      }
      catch (err) {
        console.error(err)
      }

      return filepath
    })

  if (errors.length === 0) {
    console.log('文件下载完毕')
    console.timeEnd('文件下载耗时')

    await writeFile(
      _ctx.filepath_merge_temp,
      results.filter(Boolean).map(url => `file '${url as string}'`).join('\r'),
      'utf-8',
    )

    return new Promise((resolve) => {
      console.log('合并文件中...')
      console.time('ffmpeg 合并耗时')
      exec(
        `ffmpeg -f concat -safe 0 -i ${_ctx.filepath_merge_temp} -c copy -y ${_ctx.filepath_mp4}`,
        (err) => {
          err && console.error(`exec error: ${err}`)
          console.log('合并完成')
          console.timeEnd('ffmpeg 合并耗时')
          resolve(_ctx.filepath_mp4)
        },
      )
    })
  }
  else {
    throw errors[0]
  }
}
