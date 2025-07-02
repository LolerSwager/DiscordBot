const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a user to another voice channel")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to move")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The voice channel to move the user to")
        .setRequired(true)
        .addChannelTypes(2)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const channel = interaction.options.getChannel("channel");

    // Check for admin permission (redundant, but extra safe)
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return interaction.reply({
        content: "You need to be an administrator to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!member.voice.channel) {
      return interaction.reply({
        content: "That user is not in a voice channel!",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (channel.type !== 2) {
      return interaction.reply({
        content: "Please select a valid voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await member.voice.setChannel(channel);
      await interaction.reply({
        content: `Moved ${member.user.tag} to ${channel.name}.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      await interaction.reply({
        content: `Failed to move user: ${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
