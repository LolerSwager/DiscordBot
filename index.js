const Discord = require("discord.js")
require("dotenv").config()

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("messageCreate", (message) => {
    if (message.content == "hi"){
        message.reply("Hello World!")
    }
})

client.on("messageCreate", (message) => {
    if (message.content == "lolerswager.com"){
        message.reply("https://www.lolerswager.com/")
    }
})

client.on("messageCreate", (message) => {
    if (message.content.includes("https://discord.com/invite/")){
        
        message.delete()
        .then(message => console.log(`${message.author.username} You dont have Permission to Send Discord invites ${message}`))
        .then(message.guild.channels.cache.get(message.channelId).send(`${message.author.username} You dont have Permission to Send Discord invites`))
        .catch(console.error)
    }
})

client.login(process.env.TOKEN)