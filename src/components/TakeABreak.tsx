import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GlassCard } from './GlassCard'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const PHASES: { phase: BreathPhase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Breathe in…' },
  { phase: 'hold', duration: 4, label: 'Hold gently…' },
  { phase: 'exhale', duration: 6, label: 'Breathe out…' },
  { phase: 'rest', duration: 2, label: 'Rest…' },
]

export function TakeABreak() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [countdown, setCountdown] = useState(PHASES[0].duration)

  const currentPhase = PHASES[phaseIndex]

  useEffect(() => {
    if (!isActive) return

    setCountdown(PHASES[phaseIndex].duration)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((i) => (i + 1) % PHASES.length)
          return PHASES[(phaseIndex + 1) % PHASES.length].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phaseIndex])

  const circleScale =
    currentPhase.phase === 'inhale'
      ? 1.3
      : currentPhase.phase === 'hold'
        ? 1.3
        : currentPhase.phase === 'exhale'
          ? 0.7
          : 0.85

  return (
    <GlassCard delay={0.2}>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
        Take a Break
      </h2>
      <p className="text-sm text-midnight-700/70 dark:text-cream-200/60 mb-8">
        A gentle breathing exercise to help you pause and reset.
      </p>

      <div className="flex flex-col items-center gap-8">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <motion.div
            animate={{ scale: isActive ? circleScale : 1 }}
            transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-lavender-300/50 to-blush-300/50 dark:from-lavender-400/30 dark:to-blush-400/30"
          />
          <motion.div
            animate={{ scale: isActive ? circleScale * 0.85 : 0.85 }}
            transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
            className="absolute inset-4 rounded-full glass flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key={currentPhase.phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-center"
                >
                  <p className="font-display text-lg font-medium">
                    {currentPhase.label}
                  </p>
                  <p className="text-3xl font-light mt-1 tabular-nums">{countdown}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-display text-lg text-midnight-700/60 dark:text-cream-200/50"
                >
                  Ready when you are
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isActive) {
              setIsActive(false)
              setPhaseIndex(0)
              setCountdown(PHASES[0].duration)
            } else {
              setIsActive(true)
            }
          }}
          className="rounded-2xl px-8 py-3 text-sm font-medium
            bg-gradient-to-r from-lavender-400 to-blush-400 text-white
            hover:from-lavender-300 hover:to-blush-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2
            transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isActive ? 'Stop' : 'Begin Breathing'}
        </button>
      </div>
    </GlassCard>
  )
}
