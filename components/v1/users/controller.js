"use strict";

const ControllerInterface = require("../interface/controller");
const Service = require("./service");

class Controller extends ControllerInterface {
  constructor(...arg) {
    super(...arg);

    this._userService = new Service(this.componentModel);
  }

  async signup(req, res, next) {
    try {
      console.log('sigup controller');
      const result = await this._userService.signup(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
 
  async signin(req, res, next) {
    try {
      console.log('sigin controller');
      const result = await this._userService.signin(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async signout(req, res, next) {
    try {
      console.log('signout controller');
      const result = await this._userService.signout(req);
      res.json(result);    
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
