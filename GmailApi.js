var axios = require("axios");
var qs = require("qs");

class GmailAPI {
  getAccessToken = async () => {
    var data = qs.stringify({
      client_id:
        "997112927027-hbklf2ph908pn916iqhd5pnkh273ponq.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token:
        "1//0g2dgvCT0qhrNCgYIARAAGBASNwF-L9Ir-zpATLbKWY_phXhecFyHX8VZhckQ8J1FL1aeUJYMAJibXvCh3622DrVfqpuznWZQZL0",
      grant_type: "refresh_token",
    });

    var config = {
      method: "post",
      url: "https://accounts.google.com/o/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    var accessToken = "";

    await axios(config)
      .then(async function (response) {
        accessToken = await response.data.access_token;
        console.log("Access Token: " + accessToken);
      })
      .catch(function (error) {
        console.log(error);
      });

    return accessToken;
  };

  searchGmail = async (searchItem) => {
    var config1 = {
      method: "get",
      url:
        "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    };

    var threadId = "";

    await axios(config1)
      .then(async function (response) {
        // console.log("Searched Results: " + JSON.stringify(response.data));

        
        threadId = await response.data["messages"].id;
        console.log("ThreadId: " + threadId);
      })
      .catch(function (error) {
        console.log(error);
      });

    return threadId;
  };

  readGmailContent = async (messageId) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    };

    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return data;
  };

  readInboxContent = async (searchText) => {
    const threadId = await this.searchGmail(searchText);
    const message = await this.readGmailContent(threadId);

    // console.log(message);

    const encodedMessage = await message.payload["body"].data;

    // console.log(encodedMessage);

    const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");

    console.log(decodedStr);

    return decodedStr;
  };
}

module.exports = new GmailAPI();
