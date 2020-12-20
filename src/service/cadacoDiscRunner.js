const getRosterForTeam = require('./teamRetriever').getRosterForTeam; 
const getPlayersForRoster = require('./playerRetriever').getPlayersForRoster;

async function getDiscStats (teamName, season){
    const roster = await getRosterForTeam(teamName, season);
    const playersForRoster = await getPlayersForRoster(roster, season);
    return playersForRoster;
}

exports.getDiscStats = getDiscStats;