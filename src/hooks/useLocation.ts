import { useCallback, useEffect, useRef, useState } from 'react'
import { recordEvent, saveLocationUpdate } from '../lib/firestore'
import { getOrCreateSessionId } from '../lib/session'
import type { LocationChoice } from '../types'
import { sendNtfy } from '../utils/ntfy'

interface UseLocationOptions {
  enabled: boolean
}

/** Helper: calculate distance between two lat/lon points (meters) */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371e3 // earth radius in meters
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/** Build the NTFY message for a location update */
function buildLocationMessage(
  lat: number | null,
  lon: number | null,
  accuracy: number | null,
  sessionId: string,
): string {
  const now = new Date().toLocaleString('en-US', { hour12: false })
  if (lat === null || lon === null) {
    return `📍 Location Shared\n\nLocation unavailable.\n\nTime:\n${now}\n\nSession:\n${sessionId}`
  }
  const mapsLink = `https://maps.google.com/?q=${lat},${lon}`
  return `📍 Location Shared\n\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lon.toFixed(6)}\nAccuracy: ${accuracy?.toFixed(0) ?? '0'} m\n\nOpen in Google Maps:\n${mapsLink}\n\nTime:\n${now}\n\nSession:\n${sessionId}`
}

export function useLocationTracking({ enabled }: UseLocationOptions) {
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const sessionIdRef = useRef(getOrCreateSessionId())
  // keep the last sent location to compare distance
  const lastSentRef = useRef<{ lat: number; lon: number } | null>(null)

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }, [])

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setError(null)

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        setIsTracking(true)
        const { latitude, longitude, accuracy } = position.coords
        const payload = {
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now(),
          sessionId: sessionIdRef.current,
        }
        void saveLocationUpdate(payload)

        // Determine whether to send a notification
        const shouldNotify =
          lastSentRef.current === null ||
          haversineDistance(
            lastSentRef.current.lat,
            lastSentRef.current.lon,
            latitude,
            longitude,
          ) > 50

        if (shouldNotify) {
          const message = buildLocationMessage(latitude, longitude, accuracy, sessionIdRef.current)
          void sendNtfy(message)
          lastSentRef.current = { lat: latitude, lon: longitude }
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          void recordEvent('location_permission_denied', sessionIdRef.current)
        }
        setError(err.message)
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 15_000,
      },
    )
  }, [])

  useEffect(() => {
    if (enabled) {
      startTracking()
    }
    return () => stopTracking()
  }, [enabled, startTracking, stopTracking])

  return { isTracking, error, sessionId: sessionIdRef.current }
}

export function useWelcomeFlow() {
  const [choice, setChoice] = useState<LocationChoice>('pending')
  const [isReady, setIsReady] = useState(false)
  const sessionId = getOrCreateSessionId()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleShareLocation = useCallback(async () => {
    setIsSubmitting(true)
    setChoice('share')

    if (!navigator.geolocation) {
      await recordEvent('location_permission_denied', sessionId)
      setIsReady(true)
      setIsSubmitting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    await recordEvent('location_shared', sessionId);
    const message = buildLocationMessage(latitude, longitude, accuracy, sessionId);
    await sendNtfy(message);
    setIsReady(true);
    setIsSubmitting(false);
  },
      async () => {
        await recordEvent('location_permission_denied', sessionId)
        setIsReady(true)
        setIsSubmitting(false)
      },
      { enableHighAccuracy: true, timeout: 15_000 },
    )
  }, [sessionId])

  const handleContinueWithoutSharing = useCallback(async () => {
    setIsSubmitting(true)
    setChoice('skip')
    await recordEvent('continued_without_sharing', sessionId)
    setIsReady(true)
    setIsSubmitting(false)
  }, [sessionId])

  return {
    choice,
    isReady,
    isSubmitting,
    sessionId,
    handleShareLocation,
    handleContinueWithoutSharing,
  }
}
