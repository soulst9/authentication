const { ClientError } = require("../../../libraries/error");

const USER_ERROR = {
  no_resource: {
    ko: '회원 정보를 찾을 수 없습니다.',
    en: 'Member information does not exist.',
  }
}


class UserError extends ClientError {
  constructor(args) {
    super(args);
    
    this.language = args.language || 'ko';
    this.code = args.code;
    this.message = USER_ERROR[this.code][this.language] || 'Undefined error';
  }
}

module.exports = UserError;
