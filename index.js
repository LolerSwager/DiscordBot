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
    client.user.setStatus('online')
    client.user.setActivity('Hi, im in Alpha!', { 
        type: 'WATCHING' 
    })
})

client.on("messageCreate", (message) => {
    if (message.content == "hi"){
        message.reply("Hello World!")
    }
    if (message.content == "lolerswager.com"){
        message.reply("https://www.lolerswager.com/")
    }
    const UserArr = ["218717194421403648"]
    if (message.author.id != UserArr[0]){
        if (message.content.includes('https://discord.com/invite/') || message.content.includes('https://discord.gg/')){
            message.delete()
            .then(message => console.log(`${message.author.username} You dont have Permission to Send Discord invites ${message}`))
            .then(message.guild.channels.cache.get(message.channelId).send(`<@${message.author.username}> You dont have Permission to Send Discord invites`))
            .catch(console.error)
        }
    }else{
        if (message.content.includes('https://discord.com/invite/') || message.content.includes('https://discord.gg/')){
            message.react('✅')
        }
    }
})

// msg when joing discord and leaving
const welcomeChannelId = "465225542140952624"

client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@${member.id}> Welcome to the server!`)
})

client.on("guildMemberRemove", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@${member.id}> Bye`)
})

client.login(process.env.TOKEN)