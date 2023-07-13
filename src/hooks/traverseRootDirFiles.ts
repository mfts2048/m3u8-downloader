// 遍历指定文件夹
import { readdir } from 'node:fs/promises'
import { Config } from '../create'

export async function traversalFolder(cb: (k: string) => Promise<void>) {
  const dirs = await readdir(Config.Resources_Root)

  for (const dir of dirs)
    await cb(dir)
}
