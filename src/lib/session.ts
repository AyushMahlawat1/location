const SESSION_KEY = 'ass_session_id'

export function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export function getSessionId(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}
