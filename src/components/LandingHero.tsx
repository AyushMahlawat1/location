import { motion } from 'framer-motion'

export function LandingHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-12 sm:py-20"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-[0.2em] text-lavender-400 dark:text-lavender-300 mb-4 font-medium"
      >
        Welcome to
      </motion.p>

      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-6">
        <span className="text-gradient">A Small Surprise</span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-xl mx-auto text-lg sm:text-xl text-midnight-700/80 dark:text-cream-200/70 leading-relaxed font-light"
      >
        A little corner of the internet made just for you — to breathe, unwind,
        and feel a little lighter.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        className="mt-8 inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm text-midnight-700/70 dark:text-cream-200/60"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-sage-400 animate-pulse" />
        Made with care
      </motion.div>
    </motion.section>
  )
}
