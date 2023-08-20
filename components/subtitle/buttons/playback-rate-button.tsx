import { useState } from 'react'
import { useAudioPlayer } from '../audio-provider'

const playbackRates = [
  {
    value: 0.8,
    text: '0.8',
  },
  {
    value: 1,
    text: '1x',
  },
  {
    value: 1.5,
    text: '1.5'
  },
  {
    value: 2,
    text: '2x'
  },
]

export function PlaybackRateButton({
  player,
}: {
  player: ReturnType<typeof useAudioPlayer>
}) {
  const [playbackRate, setPlaybackRate] = useState(playbackRates[1])

  return (
    <button
      type="button"
      className="relative flex h-6 w-6 items-center justify-center rounded-md text-black focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-neutral-500 dark:focus:ring-neutral-600"
      onClick={() => {
        setPlaybackRate((rate) => {
          let existingIdx = playbackRates.indexOf(rate)
          let idx = (existingIdx + 1) % playbackRates.length
          let next = playbackRates[idx]

          player.playbackRate?.(next.value)

          return next
        })
      }}
      aria-label="Playback rate"
    >
      <div className="absolute -inset-4 md:hidden" />
      <span className='text-bold text-sm text-black'>{playbackRate.text}</span>
    </button>
  )
}
