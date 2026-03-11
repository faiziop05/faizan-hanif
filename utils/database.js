const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, '../data');

function readData(fileName) {
  const filePath = path.join(dataFolder, `${fileName}.json`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

function saveData(fileName, data) {
  const filePath = path.join(dataFolder, `${fileName}.json`);
  const stringData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, stringData);
}

module.exports = { readData, saveData };