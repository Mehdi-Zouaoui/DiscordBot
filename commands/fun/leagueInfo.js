require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const apiUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TOBOZ`;
const options = {
  headers: {
    "X-Riot-Token": process.env.LOL_API_KEY,
  },
  method: "GET",
};

const getLeagueDetails = async (user) => {
  console.log("test fetching league data");
  try {
    const leagueDetails = await fetch(apiUrl, options);
    const leagueDetailsJSON = await leagueDetails.json();
    console.log("Summoner :", leagueDetailsJSON);
    return leagueDetailsJSON;
  } catch (error) {
    console.error("Error:", error);
  }
  //   return user;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lol")
    .setDescription(
      "Search League of Legend historic infos from a specified name."
    ),
  async execute(interaction) {
    const userDetails = await getLeagueDetails();
    await interaction.reply(
      `Invocateur : ${userDetails.name} Niveau de compte : ${userDetails.summonerLevel}`
    );
  },
};
