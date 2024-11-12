//js DOM updater module

//Imports here
import { sleeperData } from "./apis";

export const theDom = (function(doc) {

    //Return value of username input
    function showUsername () {
        return doc.getElementById('inputUsername').value;
    }

    //Return value of selected league
    function showSelectedLeague () {
        return doc.getElementById('inputUserLeagues').value;
    }

    //Clears exisiting options and fills with league options
    function updateUserLeagues (leagues) {
        const selectLeagues = doc.getElementById('inputUserLeagues');
        clearUserLeagues();
        for (let i = 0; i < leagues.length; i++) {
            const newOption = doc.createElement('option');
            newOption.text = leagues[i].name;
            selectLeagues.append(newOption);
        }
    }

    //Clears select input of existing leagues
    function clearUserLeagues () {
        const selectLeagues = doc.getElementById('inputUserLeagues');
        while (selectLeagues.options.length > 0) {
            selectLeagues.remove(0);
        }
    }

    //Add event listners on startup
    function listeners () {
        const getLeaguesBtn = doc.getElementById('getLeaguesBtn');
        getLeaguesBtn.addEventListener('click', sleeperData.verifyUsername);

        const goToLeagueBtn = doc.getElementById('goToLeagueBtn');
        goToLeagueBtn.addEventListener('click', () => {
            sleeperData.conglomerateLeagueData(doc.getElementById('inputUserLeagues').value);
        });
    }

    return {
        showUsername,
        showSelectedLeague,
        updateUserLeagues,
        listeners,
        //Thing 2,
        //Thing 3,
    }
})(document);