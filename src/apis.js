import { theDom } from "./module_DOM";
import { SleeperUser } from "./module_factory";
import { CleanLeague } from "./module_factory";
import { WorkingLeague } from "./module_factory";

export const sleeperData = (function() {

    //Check if Sleeper username exists and create user
    async function verifyUsername () {
        try {
            //API call here
            const userInput = theDom.showUsername();

            const apiCall = `https://api.sleeper.app/v1/user/${userInput}`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            const rootUser = SleeperUser(data);

            const userLeagues = await getLeagues(rootUser.userID);

            userLeagues.forEach(league => {
                const cleanLeagueData = CleanLeague(league);
                rootUser.userLeagues.push(cleanLeagueData);
            });

            theDom.updateUserLeagues(rootUser.userLeagues);

            return rootUser;

        } catch(error) {
            console.error(`Error occurred:`, error);
        } //finally {}
    }

    //Search for username on Sleeper and return each league
    async function getLeagues (userID) {
        try {
            const currentYear = new Date().getFullYear().toString();
            const apiCall = `https://api.sleeper.app/v1/user/${userID}/leagues/nfl/${currentYear}`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        } //finally {}
    } 

    //Get all the pertinant info together in one place
    //Gather league settings, league user info, player info, and matchup info
    async function conglomerateLeagueData (leagueInputName) {
        try {
            const id = await matchInputWithUserLeagues(leagueInputName);
            const sleeperLeague = await getLeagueInfo(id);
            const sleeperUsers = await getLeagueUsers(id);
            const sleeperRosters = await getLeagueRosters(id);

            console.log(sleeperUsers);
            console.log(sleeperRosters);

            //Create new object that contains all data in one spot
            const megaLeagueInfo = WorkingLeague(sleeperLeague);

            //For each roster, get the correlating username. Add roster with
            //username to the userList.
            sleeperRosters.forEach(roster => {
                let username = getUsernameForRoster(sleeperUsers, roster);
                roster.display_name = username;
                megaLeagueInfo.userList.push(roster);
            });

            //Add matchups to mega league
            for (let i=1; i<=megaLeagueInfo.regSeasonLength; i++) {
                const matchup = await getMatchupOfWeek(id, i);

                //For each match, pair the roster_ids to add the username
                matchup.forEach(roster => {
                    let username = getRosterID(megaLeagueInfo.userList, roster);
                    roster.display_name = username;
                });

                megaLeagueInfo.matchupList.push(matchup);
            }

            //Need to match roster's owner_id with user's user_id
            //Loop through each roster. Each iteration checks each user to 
            //see if owner_id(roster, keep) matches user_id(user, discard). If 
            //it does match, take the user's displayname and add it to 
            //megaLeagueInfo's userlist

            console.log(megaLeagueInfo);

            return megaLeagueInfo;

        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //With the given roster's owner_id, go through the user list and match the
    //owner_id with the user_id. Return the display name.
    function getUsernameForRoster (users, roster) {
        let match = users.filter(user => {
            return user.user_id === roster.owner_id;
        });
        return match[0].display_name;
    }

    //With the given roster ID, go through each matchup and match the roster IDs
    //so a user ID can be added
    function getRosterID (users, matchups) {
        let match = users.filter(user => {
            return user.roster_id === matchups.roster_id;
        });
        return match[0].display_name;
    }

    //Return matchup data from given league id and week
    async function getMatchupOfWeek (id, week) {
        try {
            const apiCall = `https://api.sleeper.app/v1/league/${id}/matchups/${week}`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //Return rosters from given league id
    async function getLeagueRosters (id) {
        try {
            const apiCall = `https://api.sleeper.app/v1/league/${id}/rosters`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //Return league id from given league name
    async function matchInputWithUserLeagues (inputName) {
        try {
            const user = await verifyUsername();
            const league = user.userLeagues.find(league => league.name === inputName);
            //Return league id
            return league.id;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //Return league settings from given league id
    async function getLeagueInfo (id) {
        try {
            const apiCall = `https://api.sleeper.app/v1/league/${id}`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //Return league users from given league id
    async function getLeagueUsers (id) {
        try {
            const apiCall = `https://api.sleeper.app/v1/league/${id}/users`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    return {
        getLeagues,
        verifyUsername,
        conglomerateLeagueData,
        //Thing 2,
        //Thing 3,
    }
})();
