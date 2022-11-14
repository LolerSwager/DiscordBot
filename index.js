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

    // lolerswager to link command
    if (message.content == "lolerswager.com") {
        message.reply("https://www.lolerswager.com/")
    }

    // jannick 0 patrick 1 emil 2
    const UserArr = [
        "218717194421403648",
        "218717534604492800",
        "228152639714492416",
    ]

    if (
        message.content.includes("https://discord.com/invite/") ||
        message.content.includes("https://discord.gg/")
    ) {
        if (message.author.id == UserArr[0]) {
            message.react("✅")
        } else {
            message.delete()
            message.guild.channels.cache
                .get(message.channelId)
                .send(
                    `<@!${message.author.id}> You dont have Permission to Send Discord invites`
                )
            nodeConsole(
                "info",
                "premission denied",
                `${message.author.username} - tryed to Send Discord invites ${message}`
            )
        }
    }

    // domains with xyz remover
    if (
        message.content.includes("https://") ||
        message.content.includes("http://")
    ) {
        if (message.content.split("/")[2].split(".").pop() == "xyz") {
            message.delete()
            client.users.cache
                .get(message.author.id)
                .send(
                    `<@!${message.author.id}> You cant send links with "xyz" do to security 🚩`
                )
            nodeConsole(
                "info",
                "premission denied",
                `${message.author.username} tryed to Send "xyz link" ${message}`
            )
        }
    }

    // restart bot command
    if (message.content == "/restart") {
        if (message.author.id == UserArr[0]) {
            message.react("🆗")
            message.reply(` SDK bot is restarting`)
            nodeConsole(
                "info",
                "restarting",
                `${message.author.username} has restarted the ${client.user.tag}`
            )
            client.destroy()
            client.login(process.env.token)
            nodeConsole("ok", "starting", `${client.user.tag}`)
        } else {
            message.react("⛔")
            message.guild.channels.cache
                .get(message.channelId)
                .send(
                    `<@!${message.author.id}> You dont have Permission to use this command`
                )
            nodeConsole(
                "info",
                "premission denied",
                `${message.author.username} tryed to restart the ${client.user.tag}`
            )
        }
    }

    //stop bot command
    if (message.content == "/stop sdk") {
        if (message.author.id == UserArr[0]) {
            message.react("🆗")
            message.reply(` SDK bot is stopping`)
            nodeConsole(
                "info",
                "stoped",
                `${message.author.username} has stoped the ${client.user.tag}`
            )
            client.destroy()
        } else {
            message.react("⛔")
            message.reply(` You dont have permission to use this command`)
            nodeConsole(
                "info",
                "premission denied",
                `${message.author.username} tryed to stop the ${client.user.tag}`
            )
        }
    }
})

// msg when joining discord and leaving
const welcomeChannelId = "465225542140952624"

// client.users.cache.get(message.author.id).send(`<@!${message.author.id}> Welcome to the server`)

client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache
        .get(welcomeChannelId)
        .send(`<@!${member.id}>🖐 Welcome to the server!`)
    client.users.cache
        .get(member.user.id)
        .send("Welcome to the server! https://www.lolerswager.com/")
})

client.on("guildMemberRemove", (member) => {
    member.guild.channels.cache
        .get(welcomeChannelId)
        .send(`<@!${member.id}> Bye 🤓`)
})

//  get member updates
client.on("guildMemberUpdate", (member) => {
    nodeConsole(
        "info",
        "member change",
        `${member.user.username} roles id's -> ${member._roles}`
    )
})

const DiscordBotLog = "985217123896934480"

client.on("guildUpdate", (oldGuild, newGuild) => {
    // guild change name
    if (oldGuild.name !== newGuild.name) {
        //member.guild.channels.cache.get(DiscordBotLog).send(`Has changes name from ${oldGuild.name} to ${newGuild.name} `)
        nodeConsole(
            "info",
            "server change",
            `Has changes name from ${oldGuild.name} to ${newGuild.name}`
        )
    }
})

client.login(process.env.TOKEN)
