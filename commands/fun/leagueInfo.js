require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const apiUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Naunne`;
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
    const playerDetails = await getTest(leagueDetailsJSON.id);
    return playerDetails;
  } catch (error) {
    console.error("Error:", error);
  }
  //   return user;
};

const getTest = async (summonerId) => {
  try {
    const test = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      options
    );
    const dataJSON = await test.json();
    return dataJSON;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lol")
    .setDescription(
      "Search League of Legend historic infos from a specified name."
    ),
  async execute(interaction) {
    const currentPlayerDetails = await getLeagueDetails();
    const details = currentPlayerDetails[0];
    await interaction.reply(
      `Invocateur : ${details.summonerName} \nRank: ${details.tier} ${
        details.rank
      } \nLP: ${details.leaguePoints} \nWins: ${details.wins} \nLosses ${
        details.losses
      } \nWinrate: ${Math.round(
        (100 * details.wins) / (details.wins + details.losses)
      )}%`
    );
  },
};
