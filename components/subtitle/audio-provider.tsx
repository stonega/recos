// forked from https://github.com/CaliCastle/cali-fm
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

interface Audio {
  src: string
}

export interface AudioData {
  audio: Audio
  title: string
}

type Player = {
  playing: boolean
  buffering: boolean
  muted: boolean
  duration: number
  currentTime: number
  meta: AudioData | null
} & Partial<{
  play: (data?: AudioData) => void
  setMeta: (data: AudioData) => void
  pause: () => void
  toggle: (data: AudioData | undefined) => void
  seekBy: (amount: number) => void
  seek: (time: number) => void
  playbackRate: (rate: number) => void
  toggleMute: () => void
  isPlaying: (data: AudioData | undefined) => boolean
}>

type ActionType =
  | { type: 'SET_META'; payload: AudioData }
  | { type: 'PLAY' }
  | { type: 'CANPLAY'}
  | { type: 'BUFFER'}
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }

export const AudioPlayerContext = createContext<Player | undefined>(undefined)

function audioReducer(state: Player, action: ActionType): Player {
  switch (action.type) {
    case 'SET_META':
      return { ...state, meta: action.payload }
    case 'CANPLAY':
      return { ...state, buffering: false}
    case 'BUFFER':
      return { ...state, buffering: true}
    case 'PLAY':
      return { ...state, playing: true }
    case 'PAUSE':
      return { ...state, playing: false }
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
  }
}

interface AudioProviderProps {
  children: ReactNode
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    buffering: true,
    muted: false,
    duration: 0,
    currentTime: 0,
    meta: null,
  })

  const playerRef = useRef<HTMLAudioElement>(null)

  const actions = useMemo(() => {
    return {
      play(data: AudioData | undefined) {
        if (data) {
          dispatch({ type: 'SET_META', payload: data })

          if (
            playerRef.current?.currentSrc !== data.audio.src &&
            playerRef.current
          ) {
            const playbackRate = playerRef.current?.playbackRate
            playerRef.current.src = data.audio.src
            playerRef.current.load()
            playerRef.current.pause()
            playerRef.current.playbackRate = playbackRate
            playerRef.current.currentTime = 0
          }
        }

        playerRef.current?.play()
      },
      pause() {
        playerRef.current?.pause()
      },
      setMeta(data:AudioData) {
        dispatch({ type: 'SET_META', payload: data })
          if (
            playerRef.current?.currentSrc !== data.audio.src &&
            playerRef.current
          ) {
            const playbackRate = playerRef.current?.playbackRate
            playerRef.current.src = data.audio.src
            playerRef.current.load()
            playerRef.current.pause()
            playerRef.current.playbackRate = playbackRate
            playerRef.current.currentTime = 0
          }
      },
      toggle(data: AudioData | undefined) {
        actions.isPlaying(data) ? actions.pause() : actions.play(data)
      },
      seekBy(amount: number) {
        if (!playerRef.current) return
        playerRef.current.currentTime += amount
      },
      seek(time: number) {
        if (!playerRef.current) return
        console.log(time);
        playerRef.current.currentTime = time
      },
      playbackRate(rate: number) {
        if (!playerRef.current) return
        playerRef.current.playbackRate = rate
      },
      toggleMute() {
        dispatch({ type: 'TOGGLE_MUTE' })
      },
      isPlaying(data: AudioData | undefined) {
        return data
          ? state.playing && playerRef.current?.currentSrc === data.audio.src
          : state.playing
      },
    }
  }, [state.playing])

  const api = useMemo(() => ({ ...state, ...actions }), [state, actions])

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      <audio
        ref={playerRef}
        onPlay={() => dispatch({ type: 'PLAY' })}
        onPause={() => dispatch({ type: 'PAUSE' })}
        onCanPlay={() => dispatch({ type: 'CANPLAY'})}
        onSeeked={() => dispatch({ type: 'CANPLAY'})}
        onSeeking={() => dispatch({ type: 'BUFFER'})}
        onTimeUpdate={(event) => {
          dispatch({
            type: 'SET_CURRENT_TIME',
            payload: Math.floor(event.currentTarget.currentTime),
          })
        }}
        onDurationChange={(event) => {
          dispatch({
            type: 'SET_DURATION',
            payload: Math.floor(event.currentTarget.duration),
          })
        }}
        muted={state.muted}
      />
    </>
  )
}

export function useAudioPlayer(data?: AudioData) {
  const player = useContext(AudioPlayerContext)
  useEffect(() => {
    if(data && player?.meta?.audio.src !== data.audio.src) player?.setMeta?.(data)
  }, [data])

  return useMemo(
    () => ({
      ...player,
      toggle() {
        player?.toggle?.(data)
      },
      get playing() {
        return player?.isPlaying?.(data) ?? false
      },
    }),
    [player, data]
  )
}
