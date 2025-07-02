const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moveall")
    .setDescription(
      "Move all users from all voice channels to one voice channel"
    )
    .addChannelOption(
      (option) =>
        option
          .setName("target")
          .setDescription("The voice channel to move everyone to")
          .setRequired(true)
          .addChannelTypes(2) // 2 = GUILD_VOICE
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Check for admin permission (redundant, but extra safe)
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return interaction.reply({
        content: "You need to be an administrator to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const targetChannel = interaction.options.getChannel("target");
    if (!targetChannel.isVoiceBased()) {
      return interaction.reply({
        content: "Please select a valid voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    let movedCount = 0;
    for (const [channelId, channel] of interaction.guild.channels.cache) {
      if (channel.isVoiceBased() && channel.id !== targetChannel.id) {
        for (const [memberId, member] of channel.members) {
          try {
            await member.voice.setChannel(targetChannel);
            movedCount++;
          } catch (err) {
            // Ignore errors (e.g., missing permissions)
          }
        }
      }
    }

    await interaction.reply({
      content: `Moved ${movedCount} user(s) to ${targetChannel.name}.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
