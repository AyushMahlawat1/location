import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../config/firebase'
import type { LocationUpdate, VisitorEvent, VisitorEventRecord } from '../types'
import { sendNtfy } from '../utils/ntfy';

async function safeAdd(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.warn(`Firebase not configured — skipping ${collectionName} write`)
    return
  }

  try {
    await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error(`Failed to write to ${collectionName}:`, error)
  }
}

/** Helper to get array from localStorage */
function getArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

/** Helper to set array in localStorage */
function setArray<T>(key: string, arr: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

export async function recordEvent(event: VisitorEvent, sessionId: string): Promise<void> {
  const record: VisitorEventRecord = { event, timestamp: Date.now(), sessionId };
  const events = getArray<VisitorEventRecord>('events');
  events.push(record);
  setArray('events', events);

  const message = `Event: ${event}\nSession: ${sessionId}\nTime: ${new Date().toISOString()}`;
  await sendNtfy(message);
}

export async function saveLocationUpdate(update: LocationUpdate): Promise<void> {
  const locations = getArray<LocationUpdate>('locations');
  locations.push({ ...update, timestamp: Date.now() });
  setArray('locations', locations);
}
