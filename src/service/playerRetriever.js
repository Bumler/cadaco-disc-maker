const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const _ = require('lodash');
const throttledClient = rateLimit(axios.create(), { maxRPS: 10 })

async function getPlayersForRoster(roster, season){
    console.log("Getting players");
    let players = [];

    _.forEach(roster, function(playerInfo){
        players.push(getPlayer(playerInfo, season));
    });

    return await Promise.all(players);
}

async function getPlayer(playerInfo, season){
    try {
        const response = await throttledClient.get(formatGetRequest(playerInfo.playerId, season));

        const playerData = response.data.sport_hitting_tm.queryResults;
        const formatted = formatPlayerData(playerInfo, playerData);

        if (!formatted)
            console.error(`No data for ${playerInfo.playerId}`);

        return formatted;
    } catch (error) {
        console.error(error);
    }
}

function formatPlayerData(playerInfo, playerData){
    console.log(`Retrieved Player: ${playerInfo.name}`);

    const ps = selectPlayerStatsForTeam(playerData, playerInfo.teamId);
    return {
        homeRun: ps.hr,
        groundOut: ps.go,
        flyOut: ps.ao,
        triple: ps.t,
        single: ps.h,
        double: ps.d,
        atBats: ps.ab,
        walk: ps.bb,
        strikeout: ps.so,
        average: ps.avg,
        ...playerInfo
    }; 
}

function selectPlayerStatsForTeam(playerData, teamId){
    return playerData.totalSize === '1' 
        ? playerData.row
        : _.find(playerData.row, {'team_id': teamId});
}

//http://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season=2020&player_id=624424&sport_hitting_tm.col_in=hr,go,ao,t,h,bb,so,d,ab,hr,avg,team_id
function formatGetRequest(playerId, season){
    return `http://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season=${season}&player_id=${playerId}&sport_hitting_tm.col_in=hr,go,ao,t,h,bb,so,d,ab,hr,avg,team_id`;
}

exports.getPlayersForRoster = getPlayersForRoster;
