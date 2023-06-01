import Discord, { Application } from "discord.js"
import "dotenv/config"
import nodeConsole from "./components/nodeConsole.js"
import nodeExit from "./components/nodeExit.js"

nodeExit()

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
})

client.on("ready", () => {
    nodeConsole("ok", "starting", `${client.user.tag}`)
    client.user.setStatus("online")
    client.user.setActivity("Hi, im in Alpha!", {
        type: "WATCHING",
    })
})

client.on("messageCreate", (message) => {
    //hi command
    if (message.content == "hi") {
        message.reply(`Hello <@!${message.author.id}> 🦄`)
    }

    // jannick 0 patrick 1 emil 2
    const UserArr = ["218717194421403648", "218717534604492800", "228152639714492416"]
    const BanedLinkEnings = [".xyz", ".zip", ".mov", "lol"]

    if (message.content.includes("http")) {
        if (message.content.includes("discord.com/invite/") || message.content.includes("discord.gg/")) {
            if (message.author.id == UserArr[0]) {
                message.react("✅")
            } else {
                message.delete()
                message.guild.channels.cache
                    .get(message.channelId)
                    .send(`<@!${message.author.id}> You dont have Permission to Send Discord invites`)
                client.users.cache
                    .get(message.author.id)
                    .send(`<@!${message.author.id}> You dont have Permission to Send Discord invites`)
                nodeConsole(
                    "info",
                    "premission denied",
                    `${message.author.username} - tryed to Send Discord invites. Message: ${message}`
                )
            }
        }

        if (message.content) {
            const found = BanedLinkEnings.find((word) => {
                const regex = new RegExp(`\\b${word}\\b`, "i")
                return regex.test(message.content)
            })

            if (found) {
                message.delete().catch(console.error)
                client.users.cache
                    .get(message.author.id)
                    .send(`<@!${message.author.id}> You cant send links with "${found}" do to security 🚩`)
                nodeConsole(
                    "info",
                    "premission denied",
                    `${message.author.username} - tryed to Send "${found} link". Message: ${message}`
                )
            }
        }
    }
})
// msg when joining discord and leaving
const welcomeChannelId = "465225542140952624"

// client.users.cache.get(message.author.id).send(`<@!${message.author.id}> Welcome to the server`)

client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@!${member.id}>🖐 Welcome to the server!`)
    client.users.cache.get(member.user.id).send("Welcome to the server! https://www.lolerswager.com/")
})

client.on("guildMemberRemove", (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send(`<@!${member.id}> Bye 🤓`)
})

//  get member updates
client.on("guildMemberUpdate", (member) => {
    nodeConsole("info", "member change", `${member.user.username} roles id's -> ${member._roles}`)
})

const DiscordBotLog = "985217123896934480"

client.on("guildUpdate", (oldGuild, newGuild) => {
    // guild change name
    if (oldGuild.name !== newGuild.name) {
        //member.guild.channels.cache.get(DiscordBotLog).send(`Has changes name from ${oldGuild.name} to ${newGuild.name} `)
        nodeConsole("info", "server change", `Has changes name from ${oldGuild.name} to ${newGuild.name}`)
    }
})

client.login(process.env.TOKEN)
