const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest a new feature or give feedback for the bot")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your suggestion or feedback")
        .setRequired(true)
    ),
  async execute(interaction) {
    const suggestion = interaction.options.getString("message");
    const userId = interaction.user.id;
    const username = interaction.user.tag;
    const timestamp = new Date().toISOString();

    const suggestionData = {
      userId,
      username,
      timestamp,
      suggestion,
    };

    const filePath = path.join(__dirname, "..", "..", "suggestions.json");
    let suggestions = [];
    if (fs.existsSync(filePath)) {
      suggestions = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    suggestions.push(suggestionData);
    fs.writeFileSync(filePath, JSON.stringify(suggestions, null, 2));

    await interaction.reply({
      content: "Thank you for your suggestion! It has been saved.",
      ephemeral: true,
    });
  },
};
