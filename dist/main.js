/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apis.js":
/*!*********************!*\
  !*** ./src/apis.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   sleeperData: () => (/* binding */ sleeperData)\n/* harmony export */ });\n/* harmony import */ var _module_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module_DOM */ \"./src/module_DOM.js\");\n/* harmony import */ var _module_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module_factory */ \"./src/module_factory.js\");\n\n\n\n\n\nconst sleeperData = (function() {\n\n    //Check if Sleeper username exists and create user\n    async function verifyUsername () {\n        try {\n            //API call here\n            const userInput = _module_DOM__WEBPACK_IMPORTED_MODULE_0__.theDom.showUsername();\n\n            const apiCall = `https://api.sleeper.app/v1/user/${userInput}`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            const rootUser = (0,_module_factory__WEBPACK_IMPORTED_MODULE_1__.SleeperUser)(data);\n\n            const userLeagues = await getLeagues(rootUser.userID);\n\n            userLeagues.forEach(league => {\n                const cleanLeagueData = (0,_module_factory__WEBPACK_IMPORTED_MODULE_1__.CleanLeague)(league);\n                rootUser.userLeagues.push(cleanLeagueData);\n            });\n\n            _module_DOM__WEBPACK_IMPORTED_MODULE_0__.theDom.updateUserLeagues(rootUser.userLeagues);\n\n            return rootUser;\n\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        } //finally {}\n    }\n\n    //Search for username on Sleeper and return each league\n    async function getLeagues (userID) {\n        try {\n            const currentYear = new Date().getFullYear().toString();\n            const apiCall = `https://api.sleeper.app/v1/user/${userID}/leagues/nfl/${currentYear}`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            return data;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        } //finally {}\n    } \n\n    //Get all the pertinant info together in one place\n    //Gather league settings, league user info, player info, and matchup info\n    async function conglomerateLeagueData (leagueInputName) {\n        try {\n            const id = await matchInputWithUserLeagues(leagueInputName);\n            const sleeperLeague = await getLeagueInfo(id);\n            const sleeperUsers = await getLeagueUsers(id);\n            const sleeperRosters = await getLeagueRosters(id);\n\n            console.log(sleeperUsers);\n            console.log(sleeperRosters);\n\n            //Create new object that contains all data in one spot\n            const megaLeagueInfo = (0,_module_factory__WEBPACK_IMPORTED_MODULE_1__.WorkingLeague)(sleeperLeague);\n\n            //For each roster, get the correlating username. Add roster with\n            //username to the userList.\n            sleeperRosters.forEach(roster => {\n                let username = getUsernameForRoster(sleeperUsers, roster);\n                roster.display_name = username;\n                megaLeagueInfo.userList.push(roster);\n            });\n\n            //Add matchups to mega league\n            for (let i=1; i<=megaLeagueInfo.regSeasonLength; i++) {\n                const matchup = await getMatchupOfWeek(id, i);\n\n                //For each match, pair the roster_ids to add the username\n                matchup.forEach(roster => {\n                    let username = getRosterID(megaLeagueInfo.userList, roster);\n                    roster.display_name = username;\n                });\n\n                megaLeagueInfo.matchupList.push(matchup);\n            }\n\n            //Need to match roster's owner_id with user's user_id\n            //Loop through each roster. Each iteration checks each user to \n            //see if owner_id(roster, keep) matches user_id(user, discard). If \n            //it does match, take the user's displayname and add it to \n            //megaLeagueInfo's userlist\n\n            console.log(megaLeagueInfo);\n\n            return megaLeagueInfo;\n\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    //With the given roster's owner_id, go through the user list and match the\n    //owner_id with the user_id. Return the display name.\n    function getUsernameForRoster (users, roster) {\n        let match = users.filter(user => {\n            return user.user_id === roster.owner_id;\n        });\n        return match[0].display_name;\n    }\n\n    //With the given roster ID, go through each matchup and match the roster IDs\n    //so a user ID can be added\n    function getRosterID (users, matchups) {\n        let match = users.filter(user => {\n            return user.roster_id === matchups.roster_id;\n        });\n        return match[0].display_name;\n    }\n\n    //Return matchup data from given league id and week\n    async function getMatchupOfWeek (id, week) {\n        try {\n            const apiCall = `https://api.sleeper.app/v1/league/${id}/matchups/${week}`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            return data;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    //Return rosters from given league id\n    async function getLeagueRosters (id) {\n        try {\n            const apiCall = `https://api.sleeper.app/v1/league/${id}/rosters`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            return data;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    //Return league id from given league name\n    async function matchInputWithUserLeagues (inputName) {\n        try {\n            const user = await verifyUsername();\n            const league = user.userLeagues.find(league => league.name === inputName);\n            //Return league id\n            return league.id;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    //Return league settings from given league id\n    async function getLeagueInfo (id) {\n        try {\n            const apiCall = `https://api.sleeper.app/v1/league/${id}`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            return data;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    //Return league users from given league id\n    async function getLeagueUsers (id) {\n        try {\n            const apiCall = `https://api.sleeper.app/v1/league/${id}/users`;\n            const response = await fetch(apiCall, {mode: 'cors'});\n            const data = await response.json();\n\n            if (!data || Object.keys(data).length === 0) {\n                throw new Error('No data returned from Sleeper API');\n            }\n\n            return data;\n        } catch(error) {\n            console.error(`Error occurred:`, error);\n        }\n    }\n\n    return {\n        getLeagues,\n        verifyUsername,\n        conglomerateLeagueData,\n        //Thing 2,\n        //Thing 3,\n    }\n})();\n\n\n//# sourceURL=webpack://weeklywinners/./src/apis.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module_DOM */ \"./src/module_DOM.js\");\n/* harmony import */ var _apis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apis */ \"./src/apis.js\");\n/* harmony import */ var _module_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module_factory */ \"./src/module_factory.js\");\n// js index. Imports go Here.\n\n//import { something } from 'somewhere';\n//import { somethingelse } from 'somewhereelse';\n\n\n\n\n\n//import { format } from \"date-fns\";\n\n_module_DOM__WEBPACK_IMPORTED_MODULE_0__.theDom.listeners();\n\n//# sourceURL=webpack://weeklywinners/./src/index.js?");

/***/ }),

/***/ "./src/module_DOM.js":
/*!***************************!*\
  !*** ./src/module_DOM.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   theDom: () => (/* binding */ theDom)\n/* harmony export */ });\n/* harmony import */ var _apis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apis */ \"./src/apis.js\");\n//js DOM updater module\n\n//Imports here\n\n\nconst theDom = (function(doc) {\n\n    //Return value of username input\n    function showUsername () {\n        return doc.getElementById('inputUsername').value;\n    }\n\n    //Return value of selected league\n    function showSelectedLeague () {\n        return doc.getElementById('inputUserLeagues').value;\n    }\n\n    //Clears exisiting options and fills with league options\n    function updateUserLeagues (leagues) {\n        const selectLeagues = doc.getElementById('inputUserLeagues');\n        clearUserLeagues();\n        for (let i = 0; i < leagues.length; i++) {\n            const newOption = doc.createElement('option');\n            newOption.text = leagues[i].name;\n            selectLeagues.append(newOption);\n        }\n    }\n\n    //Clears select input of existing leagues\n    function clearUserLeagues () {\n        const selectLeagues = doc.getElementById('inputUserLeagues');\n        while (selectLeagues.options.length > 0) {\n            selectLeagues.remove(0);\n        }\n    }\n\n    //Add event listners on startup\n    function listeners () {\n        const getLeaguesBtn = doc.getElementById('getLeaguesBtn');\n        getLeaguesBtn.addEventListener('click', _apis__WEBPACK_IMPORTED_MODULE_0__.sleeperData.verifyUsername);\n\n        const goToLeagueBtn = doc.getElementById('goToLeagueBtn');\n        goToLeagueBtn.addEventListener('click', () => {\n            _apis__WEBPACK_IMPORTED_MODULE_0__.sleeperData.conglomerateLeagueData(doc.getElementById('inputUserLeagues').value);\n        });\n    }\n\n    return {\n        showUsername,\n        showSelectedLeague,\n        updateUserLeagues,\n        listeners,\n        //Thing 2,\n        //Thing 3,\n    }\n})(document);\n\n//# sourceURL=webpack://weeklywinners/./src/module_DOM.js?");

/***/ }),

/***/ "./src/module_factory.js":
/*!*******************************!*\
  !*** ./src/module_factory.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Category: () => (/* binding */ Category),\n/* harmony export */   CleanLeague: () => (/* binding */ CleanLeague),\n/* harmony export */   SleeperUser: () => (/* binding */ SleeperUser),\n/* harmony export */   WorkingLeague: () => (/* binding */ WorkingLeague)\n/* harmony export */ });\n//Factory function module\n\nconst SleeperUser = (\n    userData\n) => {\n    let username = userData.username;\n    let userID = userData.user_id;\n    let userLeagues = [];\n\n    return {\n        username,\n        userID,\n        userLeagues,\n    }\n}\n\nconst CleanLeague = (\n    league\n) => {\n    let id = league.league_id;\n    let name = league.name;\n    let season = league.season;\n\n    return {\n        id,\n        name,\n        season\n    }\n}\n\nconst WorkingLeague = (\n    league,\n) => {\n    let leagueID = league.league_id;\n    let leagueName = league.name;\n    let season = league.season;\n    let rosterNumber = league.total_rosters;\n    let regSeasonLength = league.settings.playoff_week_start - 1;\n    let leg = league.settings.leg;\n    let userList = [];\n    let matchupList = [];\n\n    return {\n        leagueID,\n        leagueName,\n        season,\n        rosterNumber,\n        regSeasonLength,\n        leg,\n        userList,\n        matchupList\n    }\n}\n\nconst Category = (\n    category,\n    description\n) => {\n    category = category;\n    description = description;\n\n    return {\n        category,\n        description\n    }\n}\n\n//# sourceURL=webpack://weeklywinners/./src/module_factory.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;