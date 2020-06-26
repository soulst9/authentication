'use strict'

class SystemError extends Error {
  constructor(args) {
    super(args);
    this.statusCode = 500;
    this.code = 'system_error';
    this.message = '시스템에 장애가 발생하였습니다.';
  }

  print() {
    return {
      code: this.code,
      message: this.message,
    }
  }
}

module.exports = SystemError;
