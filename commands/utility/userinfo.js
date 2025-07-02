const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Choose a user to get info about")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const embed = {
      color: 0x0099ff,
      title: `User Info for ${user.tag}`,
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: "UserName", value: user.username, inline: true },
        { name: "ID", value: user.id, inline: true },
        {
          name: "verified",
          value: "❌",
          inline: true,
        },
        {
          name: "Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Profile Link",
          value: `[${user.username}](https://lolerswager.com/profile/${user.id})`,
          inline: true,
        },
        {
          name: "Roles",
          value:
            member.roles.cache
              .filter((role) => role.name !== "@everyone")
              .map((role) => role.name)
              .join(", ") || "No roles",
          inline: false,
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.tag}`,
        icon_url: interaction.user.displayAvatarURL(),
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
