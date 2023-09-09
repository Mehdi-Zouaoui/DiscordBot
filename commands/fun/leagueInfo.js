require("dotenv").config();
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  SlashCommandBuilder,
} = require("discord.js");
const apiUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/`;
const options = {
  headers: {
    "X-Riot-Token": process.env.LOL_API_KEY,
  },
  method: "GET",
};

const getLeagueDetails = async (user) => {
  try {
    const leagueDetails = await fetch(apiUrl + user, options);
    const leagueDetailsJSON = await leagueDetails.json();
    console.log(leagueDetailsJSON);
    const playerDetails = await getRankDetails(leagueDetailsJSON.id);
    const playerHistory = await getMatchHistory(leagueDetailsJSON.puuid);

    return {
      playerDetails,
      playerHistory,
    };
  } catch (error) {
    console.error("Error:", error);
  }
  //   return user;
};

const getMatchHistory = async (puuid) => {
  const historyArray = [];
  try {
    const matchHistory = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
      options
    );
    const matchHistoryJSON = await matchHistory.json();
    for (let i = 0; i < matchHistoryJSON.length; i++) {
      const matchResult = await getMatchDetails(matchHistoryJSON[i]);
      const participantId = matchResult.info.participants.findIndex(
        (participant) => participant.puuid === puuid
      );
      if (participantId !== -1) {
        historyArray.push(matchResult.info.participants[participantId].win);
      }
    }
    return historyArray;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getMatchDetails = async (match) => {
  console.log(match);
  try {
    const matchDetails = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${match}`,
      options
    );
    const matchDetailsJSON = await matchDetails.json();
    return matchDetailsJSON;
  } catch (e) {
    console.error("Error:", e);
  }
};

const getRankDetails = async (summonerId) => {
  try {
    const rankDetails = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      options
    );
    const rankDetailsJSON = await rankDetails.json();
    console.log(rankDetailsJSON);
    return rankDetailsJSON;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lol")
    .setDescription("Donne les détails du joueur sur la saison actuelle."),
  async execute(interaction) {
    const select = new StringSelectMenuBuilder()
      .setCustomId("boys")
      .setPlaceholder("Allez choisi brother !")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Alaa")
          .setDescription("OTP Swain, son fils s'appellera Jericho Llac.")
          .setValue("Naunne"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Damienne")
          .setDescription("Plus de LP que de cheveux.")
          .setValue("ObywardKillNoobi"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Yacine")
          .setDescription("3 ans qu'il est stuck en bronze IV.")
          .setValue("Frossterr"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Poukito")
          .setDescription("2 mandat de dépos pour qu'il vienne flex.")
          .setValue("Jeylabanane"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Jerem")
          .setDescription("Un shaco AP mais surtout un Aram enjoyer.")
          .setValue("jeiiro"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Mehdi")
          .setDescription(
            "Palmarès: 10 ans de jeu mais s'est fait laver par Yacine en 1V1."
          )
          .setValue("TOBOZ")
      );

    const row = new ActionRowBuilder().addComponents(select);
    const res = await interaction.reply({
      content: "Choisi un spécimen.",
      components: [row],
    });

    const collector = res.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 3_600_000,
    });

    collector.on("collect", async (i) => {
      const selection = i.values[0];
      const currentPlayerDetails = await getLeagueDetails(selection);
      const player = currentPlayerDetails.playerDetails[0];
      const history = currentPlayerDetails.playerHistory;
      const historyDisplay = history.map((result) =>
        result === true ? "❌ " : "🟢 "
      );
      console.log(historyDisplay);
      if (player != null) {
        await i.reply(
          `${i.user} a choisi ${selection}!\n\nInvocateur : ${
            player.summonerName
          } \nRank: ${player.tier} ${player.rank} \nLP: ${
            player.leaguePoints
          } \nWins: ${player.wins} \nLosses ${
            player.losses
          } \nWinrate: ${Math.round(
            (100 * player.wins) / (player.wins + player.losses)
          )}%\nHistory:${historyDisplay.join(" ")}`
        );
      } else await i.reply("Il joue plus ou en tout cas plus en ranked.");
    });
  },
};
