import Discord from "discord.js"
import 'dotenv/config'

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
        message.reply(`Hello <@!${message.author.id}> 🦄`)
    }
    if (message.content == "lolerswager.com"){
        message.reply("https://www.lolerswager.com/")
    }
    // jannick 0 patrick 1 emil 2
    const UserArr = ["218717194421403648", "218717534604492800", "228152639714492416"]
    if (message.author.id != UserArr[0]){
        if (message.content.includes('https://discord.com/invite/') || message.content.includes('https://discord.gg/')){
            message.delete()
            .then(message.guild.channels.cache.get(message.channelId).send(`<@!${message.author.id}> You dont have Permission to Send Discord invites`))
            .then(console.log(`[no Permission] ${message.author.username} tryed to Send Discord invites ${message}`))
            .catch(console.error)
        }
    }else{
        if (message.content.includes('https://discord.com/invite/') || message.content.includes('https://discord.gg/')){
            message.react('✅')
        }
    }
    if (message.content.includes('https://') || message.content.includes('http://')){
        if (message.content.split("/")[2].split(".").pop() == "xyz"){
            message.delete()
            .then(client.users.cache.get(message.author.id).send(`<@!${message.author.id}> You cant send links with "xyz" do to security 🚩`))
            .then(console.log(`[Domain detection] ${message.author.username} tryed to Send "xyz link" ${message}`))
            .catch(console.error)
        }
    }
})

// msg when joining discord and leaving
const welcomeChannelId = "465225542140952624"

client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@!${member.id}>🖐 Welcome to the server!`)
})

client.on("guildMemberRemove", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@!${member.id}> Bye 🤓`)
})

client.login(process.env.TOKEN)