const fs = require('fs');
const path = require('path');

export function readJSONFilesFromDirectory(directory) {
  const files = fs.readdirSync(directory); // Get all files in directory
  const jsonFiles = files.filter(file => path.extname(file) === '.json'); // Filter only JSON files

  const data = [];

  jsonFiles.forEach(file => {
    const filePath = path.join(directory, file);
    const fileData = fs.readFileSync(filePath, 'utf-8'); // Read file data
    const jsonData = JSON.parse(fileData); // Parse JSON data
    jsonData.__filePath = filePath;
    data.push(jsonData);
  });

  return data;
}
