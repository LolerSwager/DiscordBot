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
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
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

// this is triggerd when join a server
client.on(Events.GuildMemberAdd, async (member) => {
  console.log(`${member.guild.name}| ${member.user.tag} joined the server.`);
});

// this is triggerd when leave a server
client.on(Events.GuildMemberRemove, async (member) => {
  console.log(
    `${member.guild.name}| ${member.user.tag} left server or was kicked.`
  );
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
  // Handle button interactions first
  if (interaction.isButton() && interaction.customId.startsWith("rolebtn_")) {
    const roleId = interaction.customId.replace("rolebtn_", "");
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({ content: "Role not found.", ephemeral: true });
    }

    const member = interaction.member;
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      await interaction.reply({
        content: `Removed role: ${role.name}`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await member.roles.add(roleId);
      await interaction.reply({
        content: `Added role: ${role.name}`,
        flags: MessageFlags.Ephemeral,
      });
    }
    return; // Stop here if it was a button interaction
  }

  // Handle slash commands
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

  // Load the blocklist for the guild's
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

// Define your role buttons
const VERIFY_BUTTON = [
  { label: "Agree to terms", roleId: "1393008118572781588", emoji: "✅" },
];
const GAME_ROLE_BUTTONS = [
  { label: "Dota [omgks]", roleId: "1389744887754391552", emoji: "🎮" },
  { label: "Tarkov", roleId: "738061771037737062", emoji: "🔫" },
];

// Send the static role menu message on bot ready
client.once("ready", async () => {
  const channel = await client.channels.fetch("984050635144065025");
  if (!channel || channel.type !== ChannelType.GuildText) return;

  // Optional: Delete previous bot messages to keep it clean
  const messages = await channel.messages.fetch({ limit: 10 });
  const botMessages = messages.filter((m) => m.author.id === client.user.id);
  for (const msg of botMessages.values()) {
    await msg.delete().catch(() => {});
  }

  // First message: Rules & verification
  const verifyRow = new ActionRowBuilder().addComponents(
    VERIFY_BUTTON.map((opt) =>
      new ButtonBuilder()
        .setCustomId(`rolebtn_${opt.roleId}`)
        .setLabel(opt.label)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Success)
    )
  );

  await channel.send({
    content: `Welcome to the server!  
Please take a moment to read the rules below and click the button to verify your account and unlock access to the rest of the server.

**📜 Server Rules**

1. **No spamming** — Avoid sending repeated messages, images, or links.
2. **Use channels appropriately** — Post in the relevant channels and follow their topics.
3. **No advertising** — Promoting other servers, products, or services is not allowed without permission.
4. **Follow Discord’s Terms of Service** — https://discord.com/terms

_By clicking ✅ below, you confirm that you’ve read and agree to follow these rules._`,
    components: [verifyRow],
  });

  // Second message: Gaming roles
  const gameRow = new ActionRowBuilder().addComponents(
    GAME_ROLE_BUTTONS.map((opt) =>
      new ButtonBuilder()
        .setCustomId(`rolebtn_${opt.roleId}`)
        .setLabel(opt.label)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Secondary)
    )
  );

  await channel.send({
    content: `You can return to this message anytime to update your roles.  
Alternatively, use the \`/subscribe\` command to manage news roles.

🎮 Select your gaming interests!  
Click a button below to add or remove roles for your favorite games.
`,
    components: [gameRow],
  });
});

// Create a filter file for each guild when the bot starts
// This will create a file named <guild_id>-filter.json in the current directory
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // sets the bot's activity status
  client.user.setPresence({
    activities: [
      { name: `/subscribe to news roles`, type: ActivityType.Watching },
    ],
    status: "online",
  });

  // Ensure the filters directory exists
  const filtersDir = path.join(__dirname, "filters");
  if (!fs.existsSync(filtersDir)) {
    fs.mkdirSync(filtersDir);
  }

  // List servers it's on at startup
  const guildsInfo = [];
  for (const [id, guild] of client.guilds.cache) {
    const detailedGuild = await guild.fetch();
    guildsInfo.push({
      "Guild ID": guild.id,
      "Guild Name": guild.name,
      "Owner ID": detailedGuild.ownerId,
      Members: detailedGuild.memberCount,
      Locale: detailedGuild.preferredLocale,
      "Joined At": guild.joinedAt.toISOString(),
    });
  }
  console.table(guildsInfo);
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
