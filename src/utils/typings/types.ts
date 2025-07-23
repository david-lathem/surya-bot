import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface extendedAPICommand
  extends RESTPostAPIChatInputApplicationCommandsJSONBody {
  permissionRequired?: bigint | Array<bigint>;
  guildOnly?: Boolean;
  autocomplete?(
    interaction: AutocompleteInteraction
  ): Promise<Array<ApplicationCommandOptionChoiceData | string>>;
  execute(interaction: ChatInputCommandInteraction): Promise<any>;
}

export type channelIdQuery = { channelId: string };
export type updateStickyMessage = channelIdQuery & { messageId: string }

export type StickyMessage = channelIdQuery & {
  messageId?: string;
  content: string;
};

export interface TicketTracker {
  channelId: string;
  userId?: string;
}
