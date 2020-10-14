const fs = require('fs');
var preset = [10];
try {
  var preset = fs.readFileSync("C:/Riot Games/League of Legends/lockfile", 'utf8').split(':');
} catch (ex) {
  alert('Start the League Client First');
}

module.exports = {
  PID: 11736,
  HOST: '127.0.0.1',
  PORT: preset[2],
  USERNAME: 'riot',
  PASSWORD: preset[3],
  PROTOCOL: 'https://'
}