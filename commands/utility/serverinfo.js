const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays information about the server"),
  async execute(interaction) {
    const guild = interaction.guild;
    const memberCount = guild.memberCount;
    const createdAt = guild.createdAt.toDateString();
    const region = guild.preferredLocale;

    const totalSeconds = Math.floor(process.uptime());
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let uptimeString = "";
    if (days) uptimeString += `${days}d `;
    if (hours) uptimeString += `${hours}h `;
    if (minutes) uptimeString += `${minutes}m `;
    uptimeString += `${seconds}s`;

    const embed = {
      color: 0x0099ff,
      title: `Server Info for ${guild.name}`,
      thumbnail: { url: guild.iconURL() || "" },
      fields: [
        { name: "Member Count", value: memberCount.toString(), inline: true },
        {
          name: "Server ID",
          value: guild.id,
          inline: true,
        },
        { name: "Region", value: region, inline: true },
        {
          name: "Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: "Bot Up Time", value: uptimeString, inline: true },
        {
          name: "Owner",
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: "Roles",
          value:
            guild.roles.cache
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
