/// <reference types="./m3u8-parser.d.ts" />

import download from 'download'
import { Parser } from 'm3u8-parser'
import { ensureFileSync } from 'fs-extra'
import { create } from './create'

async function createContext(key: string) {
  const { _ctx, fileContent_json } = await create(key)

  // 下载 _url 对应的 m3u8 文件
  const body = (await download(fileContent_json._url, _ctx.folder, {
    filename: _ctx.filename_m3u8_back,
  })).toString()

  const parser = new Parser()
  parser.push(body)
  parser.end()

  // 解析
  const segments = parser.manifest.segments

  // 下载 key.key 文件
  const aes = (await download(segments[0]?.key.uri, _ctx.folder, {
    filename: _ctx.filename_key,
  })).toString()

  ensureFileSync(_ctx.filepath_merge_temp)

  return {
    ..._ctx,
    segments,
    aes,
  }
}

export {
  createContext,
}
