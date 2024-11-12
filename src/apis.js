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

            console.log(sleeperUsers)

            const megaLeagueInfo = WorkingLeague(sleeperLeague);


            for (let i=1; i<=megaLeagueInfo.regSeasonLength; i++) {
                console.log('loop!')
                const matchup = await getMatchupOfWeek(id, i);
                megaLeagueInfo.matchupList.push(matchup);
            }

            console.log(megaLeagueInfo);

            return megaLeagueInfo;

        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    async function getMatchupOfWeek (id, week) {
        try {
            const apiCall = `https://api.sleeper.app/v1/league/${id}/matchups/${week}`;
            const response = await fetch(apiCall, {mode: 'cors'});
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from Sleeper API');
            }

            console.log(data);

            return data;
        } catch(error) {
            console.error(`Error occurred:`, error);
        }
    }

    //
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
