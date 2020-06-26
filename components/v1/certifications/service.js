"use strict";

const { Op } = require('sequelize');
const randomize = require('randomatic');
const crypto = require('crypto');
// const kakao = require('../../../libraries/external/kakao');

// const { ServiceInterface } = require("../interface/service");
// const { createToken } = require("../../../libraries/helpers/token");
const common = require('../../../config/env/common');
const { selfCert } = require('../../../config/constants');
const deferrors = require("../../../libraries/error/define");
const { ClientCommonError } = require('../../../libraries/error/clientError');
const CertificationError = require("./error");
const util = require('../../../libraries/helpers/util');
const components = require("../interface/components");
const models = require('../../../models');

class Service {
  constructor(componentModel) {
    this.componentModel = componentModel;
  }

  async sendtoUser(req) {
    const { uuid } = req.decoded;
    const { type, mobile } = req.body;
    const code = randomize('0', 6);

    if (!Object.values(selfCert).includes(type)) {
      throw new ClientCommonError({
        code: deferrors.not_exist_type,
        target: type,
        message: `본인인증 타입의 값이 잘못되었습니다.(${Object.values(selfCert)})`,
      })
    }

    // send sms or send email
    if (util.equalsIgnoreCase(selfCert.SMS, type)) {
      console.log('send sms to user')
    } else if (util.equalsIgnoreCase(selfCert.EMAIL, type)) {
      console.log('send email to user')
    }

    // 회원 정보 조회
    const UserService = components.getServiceByRouterName('UsersRouter');
    const user = await UserService.readService({ uuid });
    const encryptedMobile = user.encryptMobile(mobile);

    const curTS = Math.floor(Date.now() / 1000);
    const createdAt = curTS;
    const expireTime = common.expiredTime[type] || common.expiredTime.default;      
    const expiredAt = curTS + expireTime;
    const item = {
      uuid,
      type,
      mobile: encryptedMobile,
      code,
      createdAt,
      expiredAt,
    };

    return await this.componentModel.save(item);
  }

  async confirmfromUser(req) {
    const options = {
      where: {
        expiredAt: {
          [Op.gte]: Math.floor(Date.now() / 1000),
        },
      },
    }
    const result = await this.componentModel.findOne(req.body, options);
    if (!result) {
      throw new CertificationError({ code: deferrors.no_resource });
    }
    return { result: result.dataValues };
  }
}

module.exports = Service;
