"use stric";

const Slack = require("slack-node");
const config = require("../../config/env/common");

const slack = new Slack();
slack.setWebhook(config.slack);

exports.sendSlack = (message) => {
  slack.webhook(
    {
      username: "OpenLab logger bot",
      text: "```" + message + "```",
    },
    function (err, response) {
      console.log(response);
    }
  );
};
