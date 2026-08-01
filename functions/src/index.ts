import { initializeApp } from "firebase-admin/app";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

initializeApp();

const telegramBotToken = defineSecret("TELEGRAM_BOT_TOKEN");
const telegramChatId = defineSecret("TELEGRAM_CHAT_ID");
const discordWebhookUrl = defineSecret("DISCORD_WEBHOOK_URL");
const ntfyUrl = defineSecret("NTFY_URL");

interface EventData {
  event: string;
  timestamp: number;
  sessionId: string;
}

async function sendTelegram(message: string): Promise<void> {
  const token = telegramBotToken.value();
  const chatId = telegramChatId.value();
  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  });

  if (!response.ok) {
    logger.error("Telegram notification failed", await response.text());
  }
}

async function sendDiscord(message: string): Promise<void> {
  const webhook = discordWebhookUrl.value();
  if (!webhook) return;
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
  if (!response.ok) {
    logger.error("Discord notification failed", await response.text());
  }
}

// NTFY notification
async function sendNtfy(message: string): Promise<void> {
  const url = ntfyUrl.value();
  if (!url) return;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: message,
  });
  if (!response.ok) {
    logger.error("ntfy notification failed", await response.text());
  }
}
  const webhook = discordWebhookUrl.value();
  if (!webhook) return;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });

  if (!response.ok) {
    logger.error("Discord notification failed", await response.text());
  }
}

function formatEventMessage(data: EventData): string {
  const time = new Date(data.timestamp).toISOString();
  const labels: Record<string, string> = {
    location_shared: "📍 Location Shared",
    continued_without_sharing: "👋 Continued Without Sharing",
    location_permission_denied: "🚫 Location Permission Denied",
  };

  const label = labels[data.event] || data.event;

  return [
    `<b>A Small Surprise</b>`,
    ``,
    `<b>Event:</b> ${label}`,
    `<b>Time:</b> ${time}`,
    `<b>Session:</b> <code>${data.sessionId}</code>`,
  ].join("\n");
}

export const onVisitorEvent = onDocumentCreated(
  {
    document: "events/{eventId}",
    secrets: [telegramBotToken, telegramChatId, discordWebhookUrl, ntfyUrl],
  },
  async (event) => {
    const data = event.data?.data() as EventData | undefined;
    if (!data?.event || !data?.sessionId) {
      logger.warn("Invalid event document", data);
      return;
    }

    const message = formatEventMessage(data);
    logger.info("Visitor event received", { event: data.event, sessionId: data.sessionId });

    await Promise.allSettled([sendTelegram(message), sendDiscord(message), sendNtfy(message)]);
  },
);

export const onLocationUpdate = onDocumentCreated(
  {
    document: "locations/{locationId}",
    secrets: [telegramBotToken, telegramChatId, discordWebhookUrl, ntfyUrl],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data?.latitude || !data?.sessionId) return;

    const message = [
      `<b>📍 Location Update</b>`,
      `<b>Session:</b> <code>${data.sessionId}</code>`,
      `<b>Coords:</b> ${data.latitude}, ${data.longitude}`,
      `<b>Accuracy:</b> ${Math.round(data.accuracy)}m`,
      `<b>Time:</b> ${new Date(data.timestamp).toISOString()}`,
    ].join("\n");

    await Promise.allSettled([sendTelegram(message), sendDiscord(message), sendNtfy(message)]);
  },
);
