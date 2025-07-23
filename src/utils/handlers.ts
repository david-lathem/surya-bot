import { GuildTextBasedChannel, Message, TextChannel } from "discord.js";
import {
  deleteStickyMessage,
  getStickyMessage,
  getTicketTrackerByChannel,
  updateStickyMessageId,
  updateTicketTrackerUser,
  upsertStickyMessage,
} from "../database/queries.js";

export const handleTrackingCommand = async (message: Message<true>) => {
  const reply = `
If you notice a shaking effect while in the lobby, you can disable it by turning off auto-tracking:

**PlayStation**: Press \`L2 + Right D-Pad\`
**Xbox**: Press \`LT + Right D-Pad\`

This will stop the lobby shake, making it easier to navigate menus.

Once you're in a match, press the same button combo again to re-enable auto-tracking.
Make sure the **Zen LED lights turn gold** — this indicates that auto-tracking is active.
  `.trim();

  await message.channel.send(reply);
};

export const handleReviewCommand = async (message: Message<true>) => {
  const reply = `
If you’re enjoying this script, could you take a few seconds to leave us a free review? It only takes a moment and really helps us out! You can leave your review here: https://discord.com/channels/1282790220366086226/1365773142735454420
  `.trim();

  await message.channel.send(reply);
};

export const handleMenuCommand = async (message: Message<true>) => {
  const reply = `
**To open the mod menu:**

• PlayStation:  Press L2 + Menu
• Xbox:  Press LT + Menu

**To exit the menu:**

• PlayStation:  Press ○ (Circle)
• Xbox:  Press B
  `.trim();

  await message.channel.send(reply);
};

export const handleStickySetCommand = async (
  message: Message<true>,
  content: string
) => {
  if (!content)
    return await message.reply("Please write some text to set sticky message.");

  upsertStickyMessage.run({
    channelId: message.channel.id,
    content: content,
  });
};

export const handleStickyRemoveCommand = async (message: Message) => {
  const row = getStickyMessage.get({ channelId: message.channel.id });

  if (!row)
    return await message.reply("⚠️ No sticky message found in this channel.");

  deleteStickyMessage.run({ channelId: message.channel.id });
  await message.reply("✅ Sticky message removed.");
};

export async function sendStickyMessageIfExists(
  channel: GuildTextBasedChannel
) {
  const sticky = getStickyMessage.get({ channelId: channel.id });

  if (!sticky) return;

  if (sticky.messageId)
    await channel.messages.delete(sticky.messageId).catch(console.error);

  const newStickyMessage = await channel.send(sticky.content);

  updateStickyMessageId.run({
    channelId: channel.id,
    messageId: newStickyMessage.id,
  });
}

export async function checkForTicketMessage(message: Message) {
  const { channel, author, embeds, mentions } = message;

  const existingRow = getTicketTrackerByChannel.get({ channelId: channel.id });

  if (!existingRow) return;

  if (author.id !== process.env.TICKET_TOOL_BOT_ID) return;

  if (!embeds[0]?.description?.startsWith("**Welcome to Moon Aim Support!**"))
    return;

  const mentionedUser = mentions.parsedUsers.first();

  if (!mentionedUser) return;

  const payload = {
    channelId: channel.id,
    userId: mentionedUser.id,
  };

  updateTicketTrackerUser.run(payload);
}

export async function handleHelloCommand(message: Message<true>) {
  const channelId = message.channel.id;

  const row = getTicketTrackerByChannel.get({ channelId });

  if (!row || !row.userId)
    return await message.reply(
      "Either not a ticker channel or was not able to save the user!"
    );

  await message.channel.send(
    `Hey <@${row.userId}>, thanks so much for opening a ticket! How may we help you? Are you interested in purchasing or have a general question. Let me know! I’ll be glad to assist you to the best of my ability.`
  );
}

