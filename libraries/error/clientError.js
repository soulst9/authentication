const deferrors = require('./define');

class ClientError extends Error {
  constructor(args) {
    super(args);

    this.statusCode = args.statusCode || 400;
    this.code = args.code || 'undefined code';
    this.message = args.message || 'undefined client error';

  }

  print() {
    return {
      code: this.code,
      message: this.message,
    }  
  }
}

class ClientCommonError extends ClientError {
  constructor(args) {
    super(args);
    this.message = args.message || '문제가 발생되었습니다.\n잠시 후 다시 해주세요.';
    this.target = args.target || '';
  }

  print() {
    return {
      target: this.target,
      message: this.message,
      stack: this.stack,
    }  
  }
}

module.exports = {
  ClientError,
  ClientCommonError
}