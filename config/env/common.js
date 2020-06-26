'use strict'

module.exports = {
  secretKey: {
    access_token: "!@#openlabstartserver",
    mobile: "!$thisiskey#$",
  },
  expiredTime : {
    default: 60 * 6,
    sms: 60 * 3,
    email: 60 * 60
  },
  common: {
      maxSigninTrycount: 5,
      passwordValidPeriodDay: 90,
      resetTokenExpireTime: 3
  },
  slack: "https://hooks.slack.com/services/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",
}