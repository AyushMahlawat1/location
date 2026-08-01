import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-blush-300/30 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-700" />

      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[60vh] w-[60vh] rounded-full bg-blush-300/40 blur-3xl dark:bg-blush-400/15"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full bg-lavender-300/40 blur-3xl dark:bg-lavender-400/15"
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[40vh] w-[40vh] rounded-full bg-sage-300/30 blur-3xl dark:bg-sage-400/10"
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
