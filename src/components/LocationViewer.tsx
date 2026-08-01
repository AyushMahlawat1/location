import { useEffect, useState } from 'react';
import { getSessionId } from '../lib/session';

type LocationRecord = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export function LocationViewer() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }
    try {
      const raw = localStorage.getItem('locations');
      const all: LocationRecord[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter((loc) => loc.sessionId === sessionId);
      setLocations(filtered);
    } catch (e) {
      setError('Failed to read locations');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center">Loading location data...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (locations.length === 0) return <p className="text-center">No location updates recorded for this session.</p>;

  return (
    <section className="rounded-2xl bg-white/70 dark:bg-midnight-800/70 p-4 shadow-md backdrop-blur-sm max-w-full overflow-hidden">
      <h2 className="mb-4 text-xl font-semibold text-midnight-800 dark:text-cream-100">Location Updates</h2>
      <ul className="space-y-2 text-sm text-midnight-700 dark:text-cream-200 max-h-60 overflow-y-auto">
        {locations.map((loc, i) => (
          <li key={i} className="border-b border-gray-300/30 pb-2 last:border-0 last:pb-0">
            <span className="font-medium">#{i + 1}:</span> {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)} (±{loc.accuracy} m) –{' '}
            {new Date(loc.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </section>
  );
}
