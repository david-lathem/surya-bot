import { Message } from "discord.js";
import {
  checkForTicketMessage,
  handleHelloCommand,
  handleMenuCommand,
  handleReviewCommand,
  handleStickyRemoveCommand,
  handleStickySetCommand,
  handleTrackingCommand,
  sendStickyMessageIfExists,
} from "../../utils/handlers.js";
import { isAdmin } from "../../utils/perms.js";
import { checkForFilters } from "../../utils/filter.js";

export default async (message: Message) => {
  try {
    const prefix = "?";

    if (message.author.id === message.client.user.id || !message.inGuild())
      return;

    const stuffOtherThanCmdName = message.content.split(prefix)[1] ?? "";

    const commandName = stuffOtherThanCmdName.split(" ")[0].trim();

    if (message.content.split(" ")[0].trim() === "?" + commandName) {
      let shouldDeleteOriginalMessage: Boolean = false;

      if (commandName === "tracking") {
        await handleTrackingCommand(message);
        shouldDeleteOriginalMessage = true;
      }
      if (commandName === "review") {
        await handleReviewCommand(message);
        shouldDeleteOriginalMessage = true;
      }
      if (commandName === "menu") {
        await handleMenuCommand(message);
        shouldDeleteOriginalMessage = true;
      }

      if (commandName === "hello") {
        await handleHelloCommand(message);
        shouldDeleteOriginalMessage = true;
      }

      if (commandName === "sticky_set") {
        isAdmin(message.member!);
        const remainingContent = message.content
          .split(`${prefix}${commandName}`)[1]
          ?.trim();
        await handleStickySetCommand(message, remainingContent);
      }

      if (commandName === "sticky_remove") {
        isAdmin(message.member!);
        await handleStickyRemoveCommand(message);
      }

      if (shouldDeleteOriginalMessage)
        await message.delete().catch(console.error); // original message gets deleted somehow either by user or our bot before it reaches this if condition
    }

    await checkForFilters(message);
    await checkForTicketMessage(message);
    await sendStickyMessageIfExists(message.channel);
  } catch (error) {
    if (error instanceof Error)
      await message.reply(`Err! \`${error.message}\``).catch(console.error);
    console.log(error);
  }
};
