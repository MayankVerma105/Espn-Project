const fs = require("fs");
const path = require("path"); 
const xlsx = require("xlsx");
function dirCreater(inputPath) {
    let isPresent = fs.existsSync(inputPath);
    if (isPresent == false) {
        fs.mkdirSync(inputPath);
    } else {
        //console.log(inputPath, "already present")
    }
}
function fileHandler(inputPath, dataObj) {
    let isFilePresent = fs.existsSync(inputPath);
    let arr = [];
    if (isFilePresent == false) {
        // fileCreater(inputPath, dataObj)
        arr.push(dataObj);
        excelWriter(inputPath, arr);
    } else {
        arr = excelReader(inputPath);
        arr.push(dataObj);
        excelWriter(inputPath, arr);
        // fileUpdater(inputPath, dataObj);
    }
}
function fileCreater(playerPath, dataObj) {
    let arr = [dataObj];
    fs.writeFileSync(playerPath, JSON.stringify(arr));
}
function fileUpdater(playerPath, dataObj) {
    let dataBuffer = fs.readFileSync(playerPath);
    let arr = JSON.parse(dataBuffer);
    arr.push(dataObj);
    fs.writeFileSync(playerPath, JSON.stringify(arr));
}


function excelReader(filePath) {
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets["Sheet1"];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
function excelWriter(filePath, json) {
    let newWB = xlsx.utils.book_new(); 
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, "Sheet1");
    xlsx.writeFile(newWB, filePath);
}


module.exports = {
    dirCreater: dirCreater,
    fileHandler: fileHandler
}