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
  console.log("test fetching league data");
  try {
    const leagueDetails = await fetch(apiUrl + user, options);
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
      const details = currentPlayerDetails[0];
      console.log(details);
      if (details != null) {
        await i.reply(
          `${i.user} a choisi ${selection}!\n\nInvocateur : ${
            details.summonerName
          } \nRank: ${details.tier} ${details.rank} \nLP: ${
            details.leaguePoints
          } \nWins: ${details.wins} \nLosses ${
            details.losses
          } \nWinrate: ${Math.round(
            (100 * details.wins) / (details.wins + details.losses)
          )}%`
        );
      } else await i.reply("Il joue plus ou en tout cas plus en ranked.");
    });
  },
};
