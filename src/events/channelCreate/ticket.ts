import { GuildChannel } from "discord.js";
import { creatTicketTracker } from "../../database/queries.js";

export default async (channel: GuildChannel) => {
  try {
    if (channel.parentId !== process.env.TICKET_CATEGORY_ID) return;

    creatTicketTracker.run({ channelId: channel.id });
  } catch (error) {
    console.log(error);
  }
};
