import { GlassCard } from './GlassCard'

const DEFAULT_PLAYLIST_ID = '37i9dQZF1DX4sWSpwq3LiO'

export function SpotifyEmbed() {
  const playlistId =
    import.meta.env.VITE_SPOTIFY_PLAYLIST_ID || DEFAULT_PLAYLIST_ID

  return (
    <GlassCard delay={0.1}>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
        Peaceful Playlist
      </h2>
      <p className="text-sm text-midnight-700/70 dark:text-cream-200/60 mb-6">
        Curated songs to help you unwind and feel at ease.
      </p>

      <div className="rounded-2xl overflow-hidden shadow-inner">
        <iframe
          title="Spotify peaceful playlist"
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="border-0"
        />
      </div>
    </GlassCard>
  )
}
