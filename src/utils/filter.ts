import { Message, TextChannel } from "discord.js";

// Cache to track messages per user
const messageCache: Map<string, { timestamps: number[] }> = new Map();

const MESSAGE_LIMIT = 15;
const TIME_WINDOW = 60 * 1000; // 1 minute in ms
const TIMEOUT_DURATION = 60 * 60 * 1000; // 1hr

export async function checkForFilters(message: Message<true>) {
  const { content, author, member } = message;

  if (process.env.USER_IDS_TO_NOT_APPLY_FILTER.split(",").includes(author.id))
    return;

  const logsChannel = message.client.channels.cache.get(
    process.env.LOGS_CHANNEL_ID!
  ) as TextChannel;

  // 1. Filter word check
  if (content.toLowerCase().includes("free")) {
    await message.delete();

    await logsChannel?.send(
      `${author} sent a message containing **free**. Here's what they said:\n\`\`\`${content}\`\`\``
    );
  }

  // 2. Spam tracking
  const now = Date.now();
  const userId = author.id;

  const data = messageCache.get(userId) || { timestamps: [] };
  data.timestamps = data.timestamps.filter((ts) => now - ts < TIME_WINDOW);
  data.timestamps.push(now);
  messageCache.set(userId, data);

  if (data.timestamps.length >= MESSAGE_LIMIT) {
    // Timeout the user

    if (member?.moderatable) {
      await member.timeout(
        TIMEOUT_DURATION,
        "Spamming messages (15+ in 1 min)"
      );

      await logsChannel.send(
        `🚫 ${member} has been timed out for spamming (sent ${data.timestamps.length} messages in 1 minute).`
      );
    }
    // Reset their message count
    messageCache.delete(userId);
  }
}
