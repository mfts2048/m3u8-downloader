import path from 'node:path'
import { readdirSync, statSync, unlinkSync } from 'fs-extra'

// 清理文件夹内的所有.bin文件
function cleanBin(folder: string) {
  const filenames = readdirSync(folder)

  filenames.forEach((filename) => {
    const f = path.join(folder, filename)

    if (statSync(f).isDirectory())
      cleanBin(f)

    else if (f.endsWith('.bin'))
      unlinkSync(f)
  })
}

cleanBin('E:\\MDN\\test')
