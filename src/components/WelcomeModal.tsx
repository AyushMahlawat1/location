import { motion } from 'framer-motion'

interface WelcomeModalProps {
  onShareLocation: () => void
  onContinueWithoutSharing: () => void
  isLoading?: boolean
}

export function WelcomeModal({
  onShareLocation,
  onContinueWithoutSharing,
  isLoading = false,
}: WelcomeModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="absolute inset-0 bg-midnight-900/60 backdrop-blur-md dark:bg-black/70" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-lavender-300 text-3xl"
          aria-hidden="true"
        >
          ❤️
        </motion.div>

        <h1
          id="welcome-title"
          className="font-display text-center text-3xl sm:text-4xl font-semibold text-midnight-800 dark:text-cream-50 mb-4"
        >
          Hi! I made something for you ❤️
        </h1>

        <p className="text-center text-midnight-700/80 dark:text-cream-200/80 leading-relaxed mb-8 text-sm sm:text-base">
          I wanted to make something to brighten your day. If you&apos;d like, you
          can share your location so I know you&apos;ve arrived safely. You can also
          continue without sharing—everything else will work exactly the same.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onShareLocation}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-medium
              bg-gradient-to-r from-sage-400 to-sage-300 text-midnight-900
              hover:from-sage-300 hover:to-sage-400
              focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span aria-hidden="true">🟢</span>
            Share Location
          </button>

          <button
            type="button"
            onClick={onContinueWithoutSharing}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-medium
              glass text-midnight-800 dark:text-cream-100
              hover:bg-white/60 dark:hover:bg-white/15
              focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            <span aria-hidden="true">⚪</span>
            Continue Without Sharing
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
