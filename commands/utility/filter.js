const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Manage the blocklist filter for the server")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action to perform (add/remove/view)")
        .setRequired(true)
        .addChoices(
          { name: "Add", value: "add" },
          { name: "Remove", value: "remove" },
          { name: "View", value: "view" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("Word or phrase to add/remove from the blocklist")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const action = interaction.options.getString("action");
    const word = interaction.options.getString("word");
    const guildId = interaction.guildId;
    const filePath = path.join(
      __dirname,
      "../../filters",
      `${guildId}-filter.json`
    );

    // Load the blocklist filter
    let blocklist = [];
    try {
      if (fs.existsSync(filePath)) {
        blocklist = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
    } catch (error) {
      return interaction.reply({
        content: "Failed to load the blocklist filter.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (action === "view") {
      return interaction.reply({
        content: `Current blocklist: \`${blocklist.join(", ")}\``,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!word) {
      return interaction.reply({
        content: "You must provide a word or phrase to add/remove.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (action === "add") {
      if (blocklist.includes(word)) {
        return interaction.reply({
          content: `The word \`${word}\` is already in the blocklist.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      blocklist.push(word);
    } else if (action === "remove") {
      if (!blocklist.includes(word)) {
        return interaction.reply({
          content: `The word \`${word}\` is not in the blocklist.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      blocklist = blocklist.filter((item) => item !== word);
    }

    // Save the updated blocklist
    try {
      fs.writeFileSync(filePath, JSON.stringify(blocklist, null, 2));
    } catch (error) {
      return interaction.reply({
        content: "Failed to save the blocklist filter.",
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply({
      content: `Successfully ${action}ed \`${word}\` to/from the blocklist.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
