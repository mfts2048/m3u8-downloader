/// <reference types="./m3u8-parser.d.ts" />

import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import download from 'download'
import { Parser } from 'm3u8-parser'
import { ensureFileSync } from 'fs-extra'

const Config = {
  Resources_Root: 'H:\\resources',
  Log_Prefix: 'M3u8Downloader',
  Concurrency: 5,
}

async function createContext(key: string) {
  const folder = path.join(Config.Resources_Root, key)

  const exists = existsSync(folder)
  if (!exists)
    throw new Error(`Folder ${folder} not exists.`)

  const _ctx = {
    key,
    folder,
    concurrency: Config.Concurrency,

    filename_m3u8: 'index.m3u8',
    filepath_m3u8: path.join(folder, 'index.m3u8'),
    filename_m3u8_back: 'index.m3u8.back',
    filepath_m3u8_back: path.join(folder, 'index.m3u8.back'),
    filename_key: 'key.key',
    filepath_key: path.join(folder, 'key.key'),
    filename_mp4: `${key}.mp4`,
    filepath_mp4: path.join(folder, `${key}.mp4`),
    filename_info: 'info.json',
    filepath_info: path.join(folder, 'info.json'),
    filename_log: 'log.txt',
    filepath_log: path.join(folder, 'log.txt'),
    filename_merge_temp: 'merge_temp.txt',
    filepath_merge_temp: path.join(folder, 'merge_temp.txt'),
  }

  // 检查 info.json 是否存在
  const exists_info = existsSync(_ctx.filepath_info)
  if (!exists_info)
    throw new Error(`File ${_ctx.filepath_info} not exists.`)

  // 解析 info.json 文件，获取 _url 等信息
  const fileContent_json = JSON.parse(
    await readFile(_ctx.filepath_info, { encoding: 'utf-8' }),
  ) as Data

  // 特殊处理一下 _url
  fileContent_json._url = fileContent_json._url.replace('newindex.m3u8', 'index.m3u8')

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

export interface Data {
  id: string // 唯一
  title: string
  introduction: string
  playtimes: string
  updated_at: string
  created_at: string
  authername: string
  auther_no: string
  auther: string
  is_vip: 0 | 1 // vip
  _loacl_url: string // 文件名
  _url: string // m3u8 资源网址
  topics: Array<{
    description: string
    name: string
    id: number
  }>
  m3u8DownParser: {
    key: {
      uri: string
    }
    ts: Array<{
      extinf: string
      ts: string
    }>
  }
}
