"use strict";

// const { ServiceInterface } = require("../interface/service");
const { createToken } = require("../../../libraries/helpers/token");
const kakao = require("../../../libraries/external/kakao");
const randomize = require("randomatic");
// const config = require("../../../config/env/common");
const deferrors = require("../../../libraries/error/define");
const UserError = require("./error");
const ServiceInterface = require("../interface/service");

class Service extends ServiceInterface {
  constructor(...arg) {
    super(...arg);
  }

  // sign up
  async signup(item) {
    item.point = 0;
    item.code = randomize("Aa0", 8);
    return await this.componentModel.save(item);
  }

  // sign in
  async signin(req) {
    // const options = { findOne: true, isInclude: false };
    const { oauthid, token, serviceType } = req.body;

    const user = await super.readService({ oauthid, serviceType }, { isInclude: false });

    // kakao token, id 인증 확인
    await kakao.verify(oauthid, token);

    // * oauth2 연동 결과 log 남기기
    // log table 필요?

    const data = user.dataValues;
    const payload = {
      uuid: data.uuid,
      name: data.name,
      gender: data.gender,
      email: data.email,
    };

    const accessToken = createToken(payload);
    const result = { accessToken, ...payload };
    return { result };
  }

  // 회원 탈퇴
  async signout(req) {
    try {
      const { uuid } = req.params;
      const result = this.componentModel.update({ isSignout: true }, { where: { uuid } });
      return result;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Service;
