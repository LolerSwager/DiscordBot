const { v7: uuidv7 } = require("uuidv7");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Guild,
} = require("discord.js");
require("dotenv").config();

console.log("Starting up...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Add this block to handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots and DMs
  if (message.author.bot || !message.guild) return;

  const filtersDir = path.join(__dirname, "filters");
  const filePath = path.join(filtersDir, `${message.guild.id}-filter.json`);

  // Load the blocklist for this guild
  let blocklist = [];
  try {
    if (fs.existsSync(filePath)) {
      blocklist = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    return;
  }

  // Check if the message contains any blocked word (case-insensitive)
  const content = message.content.toLowerCase();
  const matchedWord = blocklist.find((word) => {
    if (word.startsWith("*.")) {
      return content.includes(word.slice(1).toLowerCase());
    }
    return content.includes(word.toLowerCase());
  });

  if (matchedWord) {
    try {
      await message.delete();
      await message.channel.send({
        content: `${message.author}, your message was removed due to being on the blocked word list: \`${matchedWord}\` .`,
        allowedMentions: { users: [message.author.id] },
      });
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  }
});

// Create a filter file for each guild when the bot starts
// This will create a file named <guild_id>-filter.json in the current directory

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // Ensure the filters directory exists
  const filtersDir = path.join(__dirname, "filters");
  if (!fs.existsSync(filtersDir)) {
    fs.mkdirSync(filtersDir);
  }

  // Log all guild IDs and create a filter file for each guild
  client.guilds.cache.forEach((guild) => {
    console.log(`Guild ID: ${guild.id} | Guild Name: ${guild.name}`);
    const filePath = path.join(filtersDir, `${guild.id}-filter.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, JSON.stringify([], null, 2), (err) => {
        if (err) {
          console.error(`Failed to create file for guild ${guild.id}:`, err);
        } else {
          console.log(`File ${guild.id}-filter.json created successfully!`);
        }
      });
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
