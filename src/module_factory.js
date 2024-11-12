//Factory function module

export const SleeperUser = (
    userData
) => {
    let username = userData.username;
    let userID = userData.user_id;
    let userLeagues = [];

    return {
        username,
        userID,
        userLeagues,
    }
}

export const CleanLeague = (
    league
) => {
    let id = league.league_id;
    let name = league.name;
    let season = league.season;

    return {
        id,
        name,
        season
    }
}

export const WorkingLeague = (
    league,
) => {
    let leagueID = league.league_id;
    let leagueName = league.name;
    let season = league.season;
    let rosterNumber = league.total_rosters;
    let regSeasonLength = league.settings.playoff_week_start - 1;
    let leg = league.settings.leg;
    let userList = [];
    let matchupList = [];

    return {
        leagueID,
        leagueName,
        season,
        rosterNumber,
        regSeasonLength,
        leg,
        userList,
        matchupList
    }
}

export const Category = (
    category,
    description
) => {
    category = category;
    description = description;

    return {
        category,
        description
    }
}