export async function sendNtfy(message: string): Promise<void> {
  const url = (import.meta.env.VITE_NTFY_URL as string | undefined)?.trim();
  console.log('sendNtfy called with URL:', url);
  console.log('Message payload:', message);
  if (!url) {
    console.warn("NTFY_URL not configured – skipping notification");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "Title": "A Small Surprise",
        "Priority": "5",
      },
      body: message,
    });
    console.log('ntfy response status:', response.status);
    if (!response.ok) {
      console.error('Failed ntfy request', await response.text());
    }
  } catch (e) {
    console.error("Failed to send ntfy notification", e);
  }
}
