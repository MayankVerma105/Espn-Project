const request = require('request');
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const helperObj = require("./helper");
function scorecCardExecutor(url) {
    request(url, cb);
}
function cb(error, response, body) {
    if (error) {
        console.log('error:', error.message); // Print the error message
    } else if (response && response.statusCode == 404) {
        console.log("Page not found");
    } else {
        console.log("content recieved");
        // console.log(body);
        extractData(body);
    }
}
function extractData(body) {
    const JSDOM = jsdom.JSDOM;
    let dom = new JSDOM(body);
    let document = dom.window.document;
    let output = document.querySelectorAll(".ds-text-compact-xxs.ds-p-2.ds-px-4 p>span");
    let resultElem = output[0];

    let res = resultElem.textContent;// result 
    
    let otherContentElem = document.querySelector(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let otherContent = otherContentElem.textContent;

    // 0 -> team 1, team 2 name 
    let teamNamesElement = document.querySelectorAll(".ds-flex.ds-items-center.ds-cursor-pointer.ds-px-4");
    let firstTeamName = teamNamesElement[0].textContent;
    
    let firstTeamNameArr = firstTeamName.split("INNINGS"); // team INNINGS (20 overs)
    firstTeamName = firstTeamNameArr[0].trim();

    let secondTeamName = teamNamesElement[1].textContent;
    let secondTeamNameArr = secondTeamName.split("INNINGS")
    secondTeamName = secondTeamNameArr[0].trim();
    // tables -> from a match -> 4 tables -> 2 batting ,2 bowling
    // -> 0 -> team 1 batting , 1-> team 2 bowling,
    // 2 -> team 2 batting 3 -> team 1 bowling 
    
    let teamStatsElements = document.querySelectorAll(".ReactCollapse--content table");
    // let htmlString = "<table>" + teamStatsElements[0].innerHTML + "</table>" ;
    // // console.log(htmlString);
    // fs.writeFileSync("firstTeam.html", htmlString);
    // console.log("File created");

    let firstBattingTeam = teamStatsElements[0];
    let secondBattingTeam = teamStatsElements[2];



    processTeam(firstBattingTeam, firstTeamName, secondTeamName, res, otherContent);
    processTeam(secondBattingTeam, secondTeamName, firstTeamName, res, otherContent);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}
function processTeam(teamELement, currTeam, opponentTeam, result, otherDetails) {
    // it will print all the stats of it's player
    let allRowswithextras = teamELement.querySelectorAll("tbody tr.ds-border-b.ds-border-line.ds-text-tight-s");
    // console.log(allRowswithextras.length);
    for (let i = 0; i < allRowswithextras.length; i++) {
        // required rows -> remove extra rows 
        let cRow = allRowswithextras[i];
        let cols = cRow.querySelectorAll("td");
        // console.log(cols.length)
        if (cols.length == 8) {
            let name = cols[0].textContent.trim();
            let runs = cols[2].textContent;
            let balls = cols[3].textContent;
            let fours = cols[5].textContent;
            let sixes = cols[6].textContent;
            let sr = cols[7].textContent;
            console.log("Name " + name + " plays for " + currTeam + " against " + opponentTeam + " Runs " + runs + " balls " + balls +
                " fours " + fours + " sixes " + sixes + " sr " + sr +
                " result " + result + " other details " + otherDetails
            );
            let dataObj = {
                name, runs, balls, fours, sixes, sr, opponentTeam, result, otherDetails
            }
            dataOrganizer(currTeam, name, dataObj);

        }
    }
    console.log("``````````````````````````````````````````````````");
}
function dataOrganizer(teamName, playerName, dataObj) {
    // folder will not be present 
    // folder will be present
    const teamPath = path.join(__dirname, "ipl", teamName);

    helperObj.dirCreater(teamPath);
    // file will not be present
    const playerPath = path.join(teamPath, playerName + ".xlsx");

    helperObj.fileHandler(playerPath, dataObj);
}


module.exports = {
    scoreCardFn: scorecCardExecutor
}