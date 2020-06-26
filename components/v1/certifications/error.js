const { ClientError } = require("../../../libraries/error");

const CERTIFICATION_ERROR = {
  no_resource: {
    ko: '입력하신 인증번호가 일치하지 않습니다.',
    en: 'The authentication number you entered does not match.',
  },
}


class CertificationError extends ClientError {
  constructor(args) {
    super(args);
    
    this.language = args.language || 'ko';
    this.code = args.code;
    this.message = CERTIFICATION_ERROR[this.code][this.language] || 'Undefined error';
  }
}

module.exports = CertificationError;
