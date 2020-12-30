const fetch = require('node-fetch');
const {
  dialog
} = require('electron');
const {
  ipcMain
} = require('electron')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const btoa = (string) => {
  return Buffer.from(string).toString('base64');
}

class ClientAccepter {
  constructor(Secret, gameName, userid, accountid, puuid) {
    this.gameId = 0;
    this.secret = Secret;
    this.auth = this.secret.AUTH;
    this.riotAPI = 'https://euw1.api.riotgames.com/';
    this.gameName = gameName;
    this.userId = userid;
    this.accountId = accountid;
    this.puuId = puuid;
  }

  LogUserInfo() {
    console.log("GameName: ", this.gameName);
    console.log("UserId: ", this.userId);
    console.log("AccountId: ", this.accountId);
    console.log("puuId: ", this.puuId);
  }

  APIRequest(endpoint, method) {
    // TODO: Look into how to alert or show in a textarea some comments about the requests.
    // console.log(`Starting ${method} ${endpoint}`);

    return fetch(`${this.secret.PROTOCOL}${this.secret.HOST}:${this.secret.PORT}${endpoint}`, {
        method: method,
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${this.auth}`,
        }
      })
      .then(res => res.json())
      .then(res => {
        // TODO: See first TODO
        // console.log(`${method} request finished for: ${endpoint}`);
        return res;
      });
  }

  async doGetRequest(endpoint) {
    return await this.APIRequest(endpoint, 'GET');
  }

  async doPostRequest(endpoint) {
    await this.APIRequest(endpoint, 'POST');
  }

  async GetGameSession() {
    let getChampSession = await this.doGetRequest('/lol-lobby-team-builder/champ-select/v1/session');
    if (getChampSession.gameId)
      this.gameId = getChampSession.gameId;
    return getChampSession.gameId !== '';
  }

  async AcceptGame() {
    return await this.doPostRequest('/lol-matchmaking/v1/ready-check/accept');
  }

  async AutoAccepter() {
    let bAccepted = false;
    let ready = setInterval(async () => {
      let readyCheck = await this.doGetRequest('/lol-matchmaking/v1/ready-check');
      if (readyCheck.state === 'InProgress') {
        await this.AcceptGame();
      }
      bAccepted = await this.GetGameSession();

      if (readyCheck.httpStatus === 404 && bAccepted) {
        clearInterval(ready);
        // TODO: Find a way to log better in a textarea or something similar
        // console.log(`Game with id ${this.gameId} has started!`);
      }
    }, 1000);
  };
}

module.exports = ClientAccepter;