const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("subscripe to a role to receive news updates")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("subscripe to a role")
        .setRequired(true)
        .addChoices(
          { name: "add", value: "add" },
          { name: "remove", value: "remove" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("subscripe to a role")
        .setRequired(true)
        .addChoices(
          { name: "news", value: "news" },
          { name: "updates", value: "updates" },
          { name: "tarkov-news", value: "eft-news" },
          { name: "arma-refriger-wcs-news", value: "arma-news" },
          { name: "project-zomboid-news", value: "pz-news" },
          { name: "terraria-news", value: "t-news" },
          { name: "minecraft-news", value: "mc-news" },
          { name: "stormworks-news", value: "s-news" },
          { name: "farming-news", value: "f-news" },
          { name: "hogwarts-legacy-news", value: "h-news" }
        )
    ),
  async execute(interaction) {
    const action = interaction.options.getString("choice");
    const roleName = interaction.options.getString("role");
    const guild = interaction.guild;
    const member = interaction.member;

    // Find the role by name (case-insensitive)
    const role = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (!role) {
      return interaction.reply({
        content: `The '${roleName}' role does not exist. Please ask an admin to create it.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (action === "add") {
      if (member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: `You already have the '${roleName}' role.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      try {
        await member.roles.add(role);
        return interaction.reply({
          content: `You have been given the '${roleName}' role!`,
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return interaction.reply({
          content: `Failed to assign role: ${error.message}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } else if (action === "remove") {
      if (!member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: `You don't have the '${roleName}' role.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      try {
        await member.roles.remove(role);
        return interaction.reply({
          content: `The '${roleName}' role has been removed from you.`,
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return interaction.reply({
          content: `Failed to remove role: ${error.message}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } else {
      return interaction.reply({
        content: "Invalid action.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
