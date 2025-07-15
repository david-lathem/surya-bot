import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import registerEventsOnClient from "./utils/registrars/registerEvents.js";
import path from "node:path";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env") });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = [];

await registerEventsOnClient(client);

client.login(process.env.TOKEN);

export default client;
