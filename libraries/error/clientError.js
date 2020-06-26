const deferrors = require('./define');

class ClientError extends Error {
  constructor(args) {
    super(args);

    this.code = args.code || 'undefined code';
    this.statusCode = args.statusCode || 400;
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


 // getErrorMessage(componentName) {
  //   const errMsg = {
  //     ClientError: {
  //       "0000": "요청한 자원은 이미 존재합니다.",
  //       "0001": "Mandatory parameter is not enough",
  //       "0002": "Parameter type error",
  //       "0003": "Parameter size exceed",
  //       "0004": "존재하지 않는 field가 포함되어 있습니다.",
  //       "0005": "존재하지 않는 parameter가 포함되어 있습니다.",
  //       "0006": "url query에 잘못된 값이 포함되어 있습니다.",
  //       "0007": "요청한 자원이 존재하지 않습니다.",
  //       "0008": "Failed to authenticate token.",
  //       "0009": "No token provided'",
  //       "0010": "수정할 수 없는 항목이 포함되어 있습니다.",
  //       "0011": "날짜 형식이 잘못되었습니다.(ex: yyyyMMddhhmmss)",
  //       "0012": "변경할 항목이 없습니다."
  //     },
  //     UserError: {
  //       "0000": "비밀번호 입력 오류",
  //       "0001": "비밀번호는 8자리 이상 20자리 미만입니다.",
  //       "0002": "비밀번호는 특수문자,문자,숫자의 조합으로 되어야 합니다.",
  //       "0003": "일련번호는 비밀번호에 포함할 수 없습니다.",
  //       "0004": "회원정보는 비밀번호에 포함할 수 없습니다.",
  //       "0005": "아이디는 6자 이상이어야 합니다.",
  //       "0006": "현재 비밀번호가 일치하지 않습니다.",
  //       "0007": "최근 사용했던 비밀번호는 사용할 수 없습니다.",
  //       "0008": "아이디 혹은 비밀번호가 일치하지 않습니다.",
  //       "0009": "비밀번호 5회 실패로 로그인 할 수 없습니다.",
  //       "0010": "요청한 기능을 수행할 수 없는 계정입니다.",
  //       "0011": "계정 초기화 토큰이 유효하지 않습니다.",
  //       "0012": "계정 초기화 토큰이 만료되었습니다."
  //     },
  //     DepartmentError: {
  //       "0000": "요청한 대분류와 일치하는 코드를 찾을 수 없습니다."
  //     }
  //   };

    // if (errMsg[componentName][this.code] === undefined) {
    //   return "unknown error";
    // }
    // return errMsg[componentName][this.code];
  // }