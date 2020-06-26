/* jshint esversion: 6 */

const { QueryTypes } = require('sequelize');
const {
  deferrors,
  ClientError,
  ClientCommonError,
} = require("../../../libraries/error");
const Model = require("./model");

class ServiceInterface {
  constructor(componentModel) {
    if (!componentModel) {
      throw new Error("componentModel parameter not found");
    }

    if (componentModel && !componentModel instanceof Model) {
      throw new Error("Not componentModel parameter instance Model");
    }

    this.componentModel = componentModel;
  }

  async createService(frontItems, backendItems) {
    this.validate(QueryTypes.INSERT, frontItems);
    return await this.componentModel.save({
      ...frontItems,
      ...backendItems,
    });
  }

  async readService(params, options = {}) {
    options.isInclude = options.isInclude !== undefined ? options.isInclude : true;
    const result = await this.componentModel.findOne(params, options);
    if (!result) {
      throw new ClientError(deferrors.no_resource);
    }
    return result;
  }

  async readAllService(params, options = {}) {
    options.isInclude = options.isInclude !== undefined ? options.isInclude : true;
    const results = await this.componentModel.findAndCountAll(params, options);
    return results;
  }

  async updateService(where, frontItems, backendItems) {
    const options = {
      where,
    };

    this.validate(QueryTypes.UPDATE, frontItems);

    const result = await this.componentModel.update({ ...frontItems, ...backendItems }, options);
    if (result.length && result[0] === 0) {
      throw new ClientCommonError({
        code: deferrors.no_resource,
        message: "요청한 자원이 존재하지 않습니다",
        target: options.where,
      });
    }

    return result;
  }

  async deleteService(where) {
    const options = {
      where,
    };
    const result = await this.componentModel.delete(options);
    if (result === 0) {
      throw new ClientCommonError({
        message: "Delete failed",
        target: req.params,
      });
    }
    return result;
  }

  async duplicateService(params) {
    const result = await this.componentModel.duplicate(params);

    if (result) {
      throw new ClientError({
        code: deferrors.already_exist_resource,
        message: "요청한 자원은 이미 존재합니다.",
      });
    }

    return {};
  }

  async countService(params) {
    return await this.componentModel.count(params);
  }

  validate(type, items = {}) {
    switch (type) {
      case QueryTypes.INSERT:
      case QueryTypes.UPDATE:
        Object.keys(items).forEach((item) => {
          if (this.componentModel.primaryKeyAttributes.includes(item) > 0) {
            throw new ClientCommonError({
              message:
                "The primary key should be excluded from the items to be modified.",
              target: item,
            });
          } else if (this.componentModel.notUpdateable.includes(item) > 0) {
            throw new ClientCommonError({
              message: "Contains items that cannot be updated.",
              target: item,
            });
          }
        });
        break;
    }
  }
}

module.exports = ServiceInterface;
