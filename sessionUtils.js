const { writeFileSync, readFileSync, existsSync } = require('fs');

const SESSEION_FILE_PATH = "./session.json";

async function sessionSave(data) {
  // here you would save it to a file/database etc.
  // you could save it to a file: writeFile(path, JSON.stringify(data))
  await writeFileSync(SESSEION_FILE_PATH, JSON.stringify(data));
  return data;
}

async function sessionExists() {
  // here you would check if the data exists
  return await existsSync(SESSEION_FILE_PATH);
}

async function sessionLoad() {
  // here you would load the data
  return await readFileSync(SESSEION_FILE_PATH);
}

module.exports = {
  sessionSave,
  sessionExists,
  sessionLoad
}
