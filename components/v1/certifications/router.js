"use strict";

const { InsertRouter } = require("../interface/router");
const ComponentModel = require('./model');
const ControllerInterface = require("./controller");

class CertificationsRouter extends InsertRouter {
  constructor(routePath, app, sequelizeModel, except) {
    super(routePath, app, sequelizeModel, except);

    this.model = new ComponentModel(sequelizeModel);
    this._controller = new ControllerInterface(this.model);
  }

  get service() {
    return Object.assign({}, this.addService);
  }

  get addService() {
    return {
      'post /': 'sendtoUser',             // sms 인증문자 요청
      'post /confirm': 'confirmfromUser', // sms 인증문자 확인
    };
  }

  sendtoUser (req, res, next) {
    this._controller.sendtoUser(req, res, next);
  }

  confirmfromUser (req, res, next) {
    this._controller.confirmfromUser(req, res, next);
  }
}

module.exports = CertificationsRouter;