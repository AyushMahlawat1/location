import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'

interface MusicControlsProps {
  isPlaying: boolean
  volume: number
  isLoaded: boolean
  onTogglePlay: () => void
  onVolumeChange: (value: number) => void
}

export function MusicControls({
  isPlaying,
  volume,
  isLoaded,
  onTogglePlay,
  onVolumeChange,
}: MusicControlsProps) {
  return (
    <GlassCard>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            onClick={onTogglePlay}
            disabled={!isLoaded}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full
              bg-gradient-to-br from-lavender-400 to-blush-400 text-white text-xl
              shadow-lg hover:shadow-xl transition-shadow
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400"
            aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          <div>
            <h3 className="font-display text-xl font-semibold">Ambient Sounds</h3>
            <p className="text-sm text-midnight-700/70 dark:text-cream-200/60">
              {isLoaded ? 'Soft background music' : 'Loading audio…'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <span className="text-sm" aria-hidden="true">🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer
              bg-cream-200 dark:bg-midnight-600
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-lavender-400
              [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Volume"
          />
          <span className="text-sm" aria-hidden="true">🔊</span>
        </div>
      </div>
    </GlassCard>
  )
}
