export type VisitorEvent =
  | 'location_shared'
  | 'continued_without_sharing'
  | 'location_permission_denied'

export interface LocationUpdate {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  sessionId: string
}

export interface VisitorEventRecord {
  event: VisitorEvent
  timestamp: number
  sessionId: string
}

export type LocationChoice = 'pending' | 'share' | 'skip'

export type Theme = 'light' | 'dark'
