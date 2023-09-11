require("dotenv").config();
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  SlashCommandBuilder,
} = require("discord.js");
const apiUrl = `https://euw1.api.riotgames.com/lol/status/v4/platform-data`;
const options = {
  headers: {
    "X-Riot-Token": process.env.LOL_API_KEY,
  },
  method: "GET",
};

const getLolCurrentPatchInfo = async () => {
  try {
    const latestPatch = await fetch(apiUrl, options);
    const latestPatchJSON = await latestPatch.json();
    console.log(latestPatchJSON)
  } catch (e) {
    console.error("error", e);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lpc")
    .setDescription("Donne les détails sur le dernier patch en vigueur."),
  async execute(interaction) {
    await getLolCurrentPatchInfo();
    await interaction.reply(`TEST`);
  },
};
