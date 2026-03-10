const fs = require('fs');
const path = require('path');

// Tell the code exactly where the data folder is
const dataFolder = path.join(__dirname, '../data');

// A helper function to read a file
function readData(fileName) {
  const filePath = path.join(dataFolder, `${fileName}.json`);
  // Read the file and turn the JSON text back into JavaScript lists
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

// A helper function to save to a file
function saveData(fileName, data) {
  const filePath = path.join(dataFolder, `${fileName}.json`);
  // Turn the JavaScript list into JSON text and format it nicely with spaces
  const stringData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, stringData);
}

module.exports = { readData, saveData };