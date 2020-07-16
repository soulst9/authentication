"use strict";

// const { ServiceInterface } = require("../interface/service");
const { createToken } = require("../../../libraries/helpers/token");
const kakao = require("../../../libraries/external/kakao");
const randomize = require("randomatic");
// const config = require("../../../config/env/common");
const deferrors = require("../../../libraries/error/define");
const UserError = require("./error");
const ServiceInterface = require("../interface/service");
const { oauth2 } = require('../../../config/constants');

class Service extends ServiceInterface {
  constructor(...arg) {
    super(...arg);
  }

  /**
   * 
   * @param {Object} item 
   * sign up or sign in 
   * if you are already registered, log in or proceed as a member
   */
  async signupOrsignin(item) {
    if (!Object.values(oauth2).includes(item.oauthType)) {
      throw new UserError(deferrors.not_exist_type);
    }

    const { oauthId, token, serviceType } = item;
    const count = await super.countService({ oauthId, serviceType });
    let user = {};
    if (count == 0) {     // 신규 회원
      item.point = 0;
      item.code = randomize("Aa0", 8);

      user = await super.createService(item, {
        point: 0,
        code: randomize("Aa0", 8),
      });
    } else {              // 기 가입 회원
      user = await super.readService({ oauthId, serviceType }, { isInclude: false }); 
    }

    // 카카오 토큰 검증
    await kakao.verify(oauthId, token);

    const payload = user.dataValues;
    const accessToken = createToken(payload);
    const result = { accessToken, ...payload };
    return { result };
  }

  // sign up
  async signup(item) {
    item.point = 0;
    item.code = randomize("Aa0", 8);
    return await this.componentModel.save(item);
  }

  // sign in
  async signin(req) {
    const { oauthId, token, serviceType } = req.body;
    const user = await super.readService({ oauthId, serviceType }, { isInclude: false });

    // kakao token, id 인증 확인
    await kakao.verify(oauthId, token);

    // * oauth2 연동 결과 log 남기기
    // log table 필요?

    const payload = user.dataValues;
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
