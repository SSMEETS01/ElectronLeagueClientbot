const fs = require('fs');
var preset = [10];
try {
  var preset = fs.readFileSync("C:/Riot Games/League of Legends/lockfile", 'utf8').split(':');
} catch (ex) {
  alert('Start the League Client First');
}

const btoa = (string) => {
  return Buffer.from(string).toString('base64');
}

const auth = btoa(`riot:${preset[3]}`)

module.exports = {
  PID: 11736,
  HOST: '127.0.0.1',
  PORT: preset[2],
  AUTH: auth,
  PROTOCOL: 'https://',
  TOKEN: "RGAPI-64ab4ff8-5be7-4ce8-baaa-eb296751eb1c"
}