import { AnimatePresence, motion } from 'framer-motion'
import { useWelcomeFlow, useLocationTracking } from './hooks/useLocation'
import { useTheme } from './hooks/useTheme'
import { useAudio } from './hooks/useAudio'
import { WelcomeModal } from './components/WelcomeModal'
import { LocationViewer } from './components/LocationViewer'
import { Layout } from './components/Layout'
import { LandingHero } from './components/LandingHero'
import { MusicControls } from './components/MusicControls'
import { SpotifyEmbed } from './components/SpotifyEmbed'
import { TakeABreak } from './components/TakeABreak'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    choice,
    isReady,
    isSubmitting,
    handleShareLocation,
    handleContinueWithoutSharing,
  } = useWelcomeFlow()

  const { isPlaying, volume, isLoaded, togglePlay, setVolume } = useAudio()

  useLocationTracking({ enabled: isReady && choice === 'share' })

  return (
    <>
      <AnimatePresence>
        {!isReady && (
          <WelcomeModal
            onShareLocation={handleShareLocation}
            onContinueWithoutSharing={handleContinueWithoutSharing}
            isLoading={isSubmitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Layout theme={theme} onToggleTheme={toggleTheme}>
              <LandingHero />

              <div className="space-y-6 sm:space-y-8">
                <MusicControls
                  isPlaying={isPlaying}
                  volume={volume}
                  isLoaded={isLoaded}
                  onTogglePlay={togglePlay}
                  onVolumeChange={setVolume}
                />
                <SpotifyEmbed />
                <TakeABreak />
              <LocationViewer />
            </div>
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
