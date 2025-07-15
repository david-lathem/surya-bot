import { Message } from "discord.js";
import {
  checkForTicketMessage,
  handleHelloCommand,
  handleStickyRemoveCommand,
  handleStickySetCommand,
  handleTrackingCommand,
  sendStickyMessageIfExists,
} from "../../utils/handlers.js";

export default async (message: Message) => {
  try {
    const prefix = "?";

    if (message.author.id === message.client.user.id || !message.inGuild())
      return;

    const stuffOtherThanCmdName = message.content.split(prefix)[1] ?? "";

    const commandName = stuffOtherThanCmdName.split(" ")[0].trim();

    if (message.content.split(" ")[0].trim() === "?" + commandName) {
      if (commandName === "tracking") await handleTrackingCommand(message);

      if (commandName === "sticky_set") {
        const remainingContent = message.content
          .split(`${prefix}${commandName}`)[1]
          ?.trim();
        await handleStickySetCommand(message, remainingContent);
      }

      if (commandName === "sticky_remove")
        await handleStickyRemoveCommand(message);

      if (commandName === "hello") await handleHelloCommand(message);
    }

    await sendStickyMessageIfExists(message.channel);
    await checkForTicketMessage(message);
  } catch (error) {
    console.log(error);
  }
};
