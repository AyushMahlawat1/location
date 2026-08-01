import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_AUDIO_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.3)
  const [isLoaded, setIsLoaded] = useState(false)

  const audioUrl =
    import.meta.env.VITE_AMBIENT_AUDIO_URL || DEFAULT_AUDIO_URL

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.volume = volume
    audio.preload = 'metadata'

    audio.addEventListener('canplaythrough', () => setIsLoaded(true))
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return
    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
    } catch {
      // Autoplay may be blocked until user interaction
    }
  }, [isPlaying])

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(1, value)))
  }, [])

  return { isPlaying, volume, isLoaded, togglePlay, setVolume }
}
