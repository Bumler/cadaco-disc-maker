const axios = require('axios');

async function getRosterForTeam(teamName, season){
    const id = getTeamId(teamName);
    const team = await getTeam(id, season);
    console.log(team);
    return formatTeamData(team);
}

function getTeamId(teamName){
    if (teamName === "mets"){
        return 121;
    }

    return 0;
}

//http://lookup-service-prod.mlb.com/json/named.roster_team_alltime.bam?start_season=2020&end_season=2020&team_id=121&roster_team_alltime.col_in=player_id,player_first_last_html,primary_position
async function getTeam(teamId, season){
    try {
        const response = await axios.get(formatGetRequest(teamId, season));
        console.log(response);
        return response.data.roster_team_alltime.queryResults.row;
    } catch (error) {
        console.error(error);
    }
}

function formatTeamData(teamData){
    return teamData.map(formatPlayerData);
}

function formatPlayerData(playerData){
    const splitName = playerData.name_last_first.split(',');
    const firstName = splitName[1].trim();
    const lastName = splitName[0];

    return {
        teamId: playerData.team_id,
        primaryPosition: playerData.primary_position,
        name: playerData.name_last_first,
        playerId: playerData.player_id,
        firstName, lastName
    }
}

function formatGetRequest(teamId, season){
    return `http://lookup-service-prod.mlb.com/json/named.roster_team_alltime.bam?start_season=${season}&end_season=${season}&team_id=${teamId}&roster_team_alltime.col_in=player_id,primary_position,team_id,name_last_first`
}

exports.getRosterForTeam = getRosterForTeam;