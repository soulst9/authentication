"use strict";

const ModelAbstract = require("../interface/model");

class UserModel extends ModelAbstract {
  constructor(sequelizeModel) {
    super(sequelizeModel);
    this.orderby = ['name', 'asc'];
    this.excludeAttributes = ['oauthId', 'serviceType'];
    this.notUpdateableFields = ['point'];
  }
}

module.exports = UserModel;