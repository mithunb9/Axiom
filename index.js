const { REST, Routes } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createWorker } = require("tesseract.js");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const parseImage = async (imageUrl) => {
  const worker = await createWorker();

  (async () => {
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageUrl);
    console.log(text);
    await worker.terminate();
  })();
};

const sendSchedule = new SlashCommandBuilder()
  .setName("sendschedule")
  .setDescription("Sends the schedule image")
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
  sendSchedule,
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
  if (interaction.commandName === "sendschedule") {
    const imageUrl = interaction.options.getString("image");
    parseImage(imageUrl);
    await interaction.reply({ files: [imageUrl] });
  }
});

client.login(process.env.TOKEN);
