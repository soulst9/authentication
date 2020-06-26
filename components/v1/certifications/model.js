"use strict";

const ModelAbstract = require("../interface/model");

class CertificationModel extends ModelAbstract {
  constructor(sequelizeModel) {
    super(sequelizeModel);
    this.orderby = ['createdAt', 'desc'];
    this.excludeAttributes = ['id', 'uuid', 'type', 'createdAt', 'expiredAt', 'mobile'];
  }

}

module.exports = CertificationModel;