const { REST, Routes } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const https = require("https");

const sendImage = new SlashCommandBuilder()
  .setName("sendimage")
  .setDescription("Sends an image")
  .addStringOption((option) =>
    option
      .setName("image")
      .setDescription("The URL or attachment of the image")
      .setRequired(true)
  );

const commands = [
  {
    name: "bing",
    description: "Replies with Bong!",
  },
  sendImage,
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "bing") {
    await interaction.reply("Bong!");
  }
  if (interaction.commandName === "sendimage") {
    const imageUrl = interaction.options.getString("image");
    await interaction.reply({ files: [imageUrl] });
  }
});

client.login(process.env.TOKEN);
