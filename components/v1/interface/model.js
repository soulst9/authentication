/* jshint esversion: 6 */

const Sequelize = require("sequelize");
const _ = require('lodash');
const models = require("../../../models");

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;

const validQueryKeywords = [
  "order",
  "dir",
  "offset",
  "limit",
  "fields",
  "like",
  "join",
];

class ModelAbstract {
  constructor(sequilizeModel, options = {}) {
    if (new.target === ModelAbstract) {
      throw new Error("Cannot construct ModelAbstract instances directly");
    }

    if (!sequilizeModel || !sequilizeModel instanceof Sequelize.Model) {
      throw new Error("Not found sequelize Model instance.");
    }
    this.excludeAttributes = [];
    this.notUpdateableFields = [];
    this.sequilizeModel = sequilizeModel;
    this.options = options;
  }

  get model() {
    return this.sequilizeModel;
  }

  get primaryKeyAttributes() {
    return this.sequilizeModel.primaryKeyAttributes;
  }

  get attributes() {
    return Object.keys(this.sequilizeModel.rawAttributes);
  }

  get notUpdateable() {
    return this.notUpdateableFields;
  }

  getAttributeDataType(attr) {
    return this.sequilizeModel.rawAttributes[attr];
  }

  _findOptions(params, options = {}) {
    if (options.isInclude) {
      options = this._optionInclude(options);
    }

    const filter_params = this.excludeKeyword(params);
    options.where = this.matchFulltext(filter_params);
    options.attributes = this.partialResponse(params.fields);
    
    // ### 시간될 때 처리할 것
    // ### this.orderby가 정의되어 있지 않을 경우 자동 처리 방법 처리 필요
    // ###
    options.order = (params.order && params.dir) ? [[params.order, params.dir]] : [[...this.orderby]];
    options.offset = Number(params.offset) || DEFAULT_OFFSET;
    options.limit = Number(params.limit) || DEFAULT_LIMIT;

    return options;
  }

  async findOne(params = {}, options = {}) {
    if (options.isInclude) {
      options = this._optionInclude(options);
    }

    const filter_params = this.excludeKeyword(params);
    options.where = { ...options.where, ...filter_params };

    options.attributes = this.partialResponse(params.fields).filter(attr => !this.excludeAttributes.includes(attr));
    
    return await this.model.findOne(options);
  }

  async findAll(params, options) {
    this._findOptions(params, options);
    return await this.model.findAll(options);
  }

  async findAndCountAll(params, options) {
    this._findOptions(params, options);
    return await this.model.findAndCountAll(options);
  }

  async save(item, transaction) {
    const result = await this.model.create(item, { fields: this.attributes, transaction });
    if (result) {
      result.dataValues = _.omit(result.dataValues, this.excludeAttributes);
    }
    return result;
  }

  async saveMany(items) {
    return await this.model.bulkCreate(items, { validate: true });
  }

  async update(values, options = {}) {
    // this.validate(QueryTypes.UPDATE, values);
    return await this.model.update(values, options);
  }

  async delete(options = {}) {
    return await this.model.destroy(options);
  }

  async duplicate(params) {
    const options = {
      where: params
    }
    return await this.model.findOne(options);
  }

  async count(params) {
    const options = {
      where: params,
    }
    return await this.model.count(options);
  }

  async query(sql) {
    // const query = new Query();
    // return await query.execute(sql);
    // return await this.model.query(sql);
  }

  get fulltextIndex() {
    return this.model.options.indexes.filter(
      (elem) => elem.type === "FULLTEXT"
    );
  }

  _optionInclude(options) {

    // console.log('=========>_optionInclude', this.model.associations)

    let associations = undefined;
    if (this.model.associations) {
      associations = Object.values(this.model.associations).map(model => {
        if (models[model]) {
          return models[model];
        }
        return models[model.options.name.singular];
      });
    }

    if (associations === undefined) {
      throw new Error('associations value cannot be undefined');
    }
    
    if (options.includeOptions.where) {
      options.include = [{
        model: associations[0],
        where: options.includeOptions.where,
        required: options.includeOptions.required,
      }]
    } else {
      options.include = associations;
    }
    return options;
  }

  // fulltext search
  matchFulltext(params) {
    if (this.fulltextIndex.length === 0) {
      return params;
    }
    let fulltextIndex = this.fulltextIndex[0];

    let fulltextResult;
    let equalResult = [];
    Object.keys(params).forEach((key) => {
      if (fulltextIndex.fields.includes(key)) {
        fulltextResult = Sequelize.literal(
          `match (${fulltextIndex.fields.join(",")}) against ("${params[key]}")`
        );
      } else {
        equalResult.push({ [key]: params[key] });
      }
    });

    let results = undefined;
    if (fulltextResult && equalResult.length) {
      // mix fulltext search and equal search
      results = [...equalResult, ...[fulltextResult]];
    } else if (fulltextResult && !equalResult.length) {
      // fulltext search only
      results = fulltextResult;
    } else if (!fulltextResult && equalResult.length) {
      // equal only
      results = params;
    }

    return results;
  }

  excludeKeyword(params) {
    return Object.assign(
      {},
      ...Object.keys(params).map((key) =>
        validQueryKeywords.includes(key) ? {} : { [key]: params[key] }
      )
    );
  }

  partialResponse(fields) {
    if (!fields) {
      return this.attributes;
    }

    const result = [];
    const field_arr = fields.toLowerCase().split(",");

    field_arr.forEach((key) => {
      if (this.attributes.includes(key)) {
        result.push(key);
      }
    });
    return result;
  }
}

module.exports = ModelAbstract;
