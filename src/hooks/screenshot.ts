import path from 'node:path'
import ffmpeg from 'fluent-ffmpeg'
import { secondsToTime, timeToSeconds } from './helper'

function getScreenshot(
  input: string,
  output: string,
  timemark: string,
) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .on('end', () => {
        resolve(true)
      })
      .on('error', (err) => {
        reject(err)
      })
      .takeScreenshots(
        {
          folder: path.dirname(output),
          filename: path.basename(output),
          count: 1,
          timemarks: [timemark],
        },
      )
  })
}

async function getScreenshots(input: string, outputDir: string, count: number): Promise<string[]>
async function getScreenshots(input: string, outputDir: string, timemarks: string[]): Promise<string[]>
async function getScreenshots(input: string, outputDir: string, count: number | string[]): Promise<string[]> {
  const duration = (await getVideoDuration(input)).seconds
  const timemarks = Array.isArray(count) ? count : getRandomTimestamps(duration, count)

  return Promise.all(timemarks.map(async (timemark) => {
    const output = path.join(
      outputDir,
      `${path.basename(input, path.extname(input))}-${timeToSeconds(timemark)}.png`,
    )
    await getScreenshot(input, output, timemark)
    return output
  }),
  )
}

function getVideoDuration(input: string): Promise<{
  seconds: number
  timestamp: string
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err: any, metadata: any) => {
      if (err)
        return reject(err)

      const duration = metadata.format.duration
      resolve({
        seconds: duration,
        timestamp: secondsToTime(duration),
      })
    })
  })
}

function getRandomTimestamp(duration: number) {
  return secondsToTime(Math.random() * duration)
}

function getRandomTimestamps(duration: number, count: number) {
  return new Array(count).fill(0).map(() => getRandomTimestamp(duration))
}

export {
  getRandomTimestamp,
  getRandomTimestamps,
  getScreenshot,
  getScreenshots,
  getVideoDuration,
}
