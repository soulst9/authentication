"use strict";

const ModelAbstract = require("../interface/model");

class UserModel extends ModelAbstract {
  constructor(sequelizeModel) {
    super(sequelizeModel);
    this.orderby = ['name', 'asc'];
    this.excludeAttributes = ['oauthId'];
  }
}

module.exports = UserModel;