import { GuildMember } from "discord.js";

export default async (member: GuildMember) => {
  try {
    const role = member.guild.roles.cache.get(process.env.WELCOME_ROLE_ID);

    if (!role) return console.log("Member joined but no role found");

    await member.roles.add(role);
  } catch (error) {
    console.log(error);
  }
};
