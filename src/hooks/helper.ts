import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function timeToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

export function secondsToTime(totalSeconds: number): string {
  if (totalSeconds === 0)
    return '00:00:00'

  const duration = dayjs.duration(totalSeconds, 'seconds')
  const hours = Math.floor(duration.asHours())
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
