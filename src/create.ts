import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const Config = {
  Resources_Root: 'H:\\resources',
  Log_Prefix: 'M3u8Downloader',
  Concurrency: 5,
}

export async function create(key: string) {
  const folder = path.join(Config.Resources_Root, key)

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

  const exists = existsSync(folder)
  if (!exists)
    throw new Error(`Folder ${folder} not exists.`)

  const exists_info = existsSync(_ctx.filepath_info)
  if (!exists_info)
    throw new Error(`File ${_ctx.filepath_info} not exists.`)

  const fileContent_json = JSON.parse(
    await readFile(_ctx.filepath_info, { encoding: 'utf-8' }),
  ) as Data

  fileContent_json._url = fileContent_json._url.replace('newindex.m3u8', 'index.m3u8')

  return {
    folder,
    _ctx,
    fileContent_json,
  }
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
