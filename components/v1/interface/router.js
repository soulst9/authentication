"use strict";

const { SystemError } = require("../../../libraries/error");
const models = require('../../../models');

class Router {
  constructor(routePath, app, sequelize, except = []) {
    if (!routePath || !app || !sequelize) {
      throw new SystemError(`required argument not enough`);
    }

    if (!Array.isArray(except)) {
      throw new SystemError("except paramater is array");
    }

    this.sequelize = sequelize;
    this.routePath = routePath;
    this.app = app;
    this.except = except;

    this._registerService();
  }

  get primaryKeys() {
    return this.sequelize.primaryKeyAttributes;
  }

  get foreignKeys() {
    return Object.values(this.sequelize.associations).map(model => model.foreignKey); 
  }

  get associations() {
    return this.sequelize.associations;
  }

  get controller() {
    return this._controller;
  }

  get service() {
    return {};
  }

  _registerService() {
    try {
      let router_services = this.service;
      Object.keys(router_services).forEach(element => {
        let items = element.split(" "),
          method = items[0],
          path = this.routePath + items[1],
          service_fuction = router_services[element];
        console.log(
          method,
          path,
          Array.isArray(service_fuction) ? 'array function' : typeof this[service_fuction],
          service_fuction + "()"
        );
        
        if (Array.isArray(service_fuction)) {
          let cbFuncChain = [];
          service_fuction.forEach(func => {
            cbFuncChain = [ ...cbFuncChain, this[func].bind(this)];
          })
          this.app[method](path, cbFuncChain);
        } else {
          this.app[method](path, this[service_fuction].bind(this));
        }
      });
      console.log(
        "[" +
          this.routePath +
          "] router success : " +
          Object.keys(router_services).length
      );
    } catch (error) {
      return { error };
    }
  }

  create(req, res, next) {
    this._controller.createController(req, res, next);
  }

  readAll(req, res, next) {
    this._controller.readAllController(req, res, next);
  }

  read(req, res, next) {
    this._controller.readController(req, res, next);
  }

  update(req, res, next) {
    this._controller.updateController(req, res, next);
  }

  delete(req, res, next) {
    this._controller.deleteController(req, res, next);
  }

  duplicate(req, res, next) {
    this._controller.duplicateController(req, res, next);
  }

  count(req, res, next) {
    this._controller.countController(req, res, next);
  }
}

class ReadRouter extends Router {
  constructor(...arg) {
    super(...arg);
  }

  get service() {
    let result = {};
    result["get "] = "readAll";
    result["get /count"] = "count";

    let fullpath = "";
    let primaryKeys = this.sequelize.primaryKeyAttributes;

    const filteredItems = primaryKeys.filter(
      (item) => !this.except.includes(item)
    );
    filteredItems.forEach((key) => {
      fullpath += `/:${key}`;
      result[`get ${fullpath}`] = "read";
    });
    return result;
  }
}

class InsertRouter extends Router {
  constructor(...arg) {
    super(...arg);
  }

  get service() {
    let result = {};
    result["post "] = "create";
    result["get "] = "readAll";
    result["get /count"] = "count";

    let fullpath = "";
    const primaryKeys = this.sequelize.primaryKeyAttributes;

    // Object.keys(this.associations).forEach(model => {
    //   console.log(models[model].primaryKeyAttributes)
    // })

    const filteredItems = primaryKeys.filter(
      (item) => !this.except.includes(item)
    );
    filteredItems.forEach((key) => {
      fullpath += `/:${key}`;
      result[`get ${fullpath}`] = "read";
    });
    result[`put ${fullpath}`] = "update";
    result[`get ${fullpath}/duplicate`] = "duplicate";
    result[`delete ${fullpath}`] = "delete";
    return result;
  }
}

module.exports = {
  InsertRouter,
  ReadRouter,
};
