"use strict";

const ControllerInterface = require("../interface/controller");
const Service = require("./service");

class Controller extends ControllerInterface {
  constructor(...arg) {
    super(...arg);

    this._selfCertService = new Service(this.componentModel);
  }

  async sendtoUser(req, res, next) {
    try {
      console.log('sendtoUser controller');
      const result = await this._selfCertService.sendtoUser(req);
      res.json(result);      
    } catch (error) {
      console.log('sendtoUser', error)
      next(error);
    }
  }

  async confirmfromUser(req, res, next) {
    try {
      console.log('confirmfromUser controller');
      const result = await this._selfCertService.confirmfromUser(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
