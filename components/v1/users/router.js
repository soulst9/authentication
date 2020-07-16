"use strict";

const { InsertRouter } = require("../interface/router");
const ComponentModel = require('./model');
const ControllerInterface = require("./controller");

class UsersRouter extends InsertRouter {
  constructor(routePath, app, sequelizeModel, except) {
    super(routePath, app, sequelizeModel, except);

    this.model = new ComponentModel(sequelizeModel);
    this._controller = new ControllerInterface(this.model);
  }

  get service() {
    return Object.assign(super.service, this.addService);
  }

  /**
   * Router path 추가 시
   * `path`: `function()`의 형식으로 기술하여 Object 추가
   * example
   * 'get /:PrimaryKey/run: 'run'
   */

  get addService() {
    return {
      'post ': 'signup',
      'post /signupOrsignin': 'signupOrsignin',
      'delete /:uuid': 'signout',
      'post /signin': 'signin',
    };
  }

  /**
   * 추가할 function()에 대해 controller 연결해주는 부분
   * example
   * `run()` 함수 추가할 경우 아래와 같이 기술
   * }
   */

  signupOrsignin(req, res, next) {
    this._controller.signupOrsignin(req, res, next);
  }

  signup(req, res, next) {
    this._controller.signup(req, res, next);
  }

  signout(req, res, next) {
    this._controller.signout(req, res, next);
  }

  signin(req, res, next) {
    this._controller.signin(req, res, next);
  }
}

module.exports = UsersRouter;