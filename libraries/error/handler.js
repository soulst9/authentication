"use strict";

const { ClientError, ClientCommonError } = require('./clientError');
const SystemError = require('./systemError');


module.exports = function errorHandler(err, req, res, next) {

  console.error('handler', err);

  if (res.headersSent) {
    return next(err);
  }

  // Component Error가 아닐 경우
  if (!err.statusCode) {
    switch (err.name) {
      case 'SequelizeValidationError':
      case 'SequelizeUniqueConstraintError':
        err = new ClientCommonError({
          message: err.errors[0].message,
          target: err.errors[0].path,
        })
        break;
      case 'SequelizeDatabaseError':
        err = new ClientCommonError({
          message: err.original.sqlMessage,
        })
        break;
      case 'JsonWebTokenError':
        err = new ClientError({
          code: err.name,
          message: err.message,
        })
        break;
      default:
        err = new SystemError();
        break;
    }
  }

  res.status(err.statusCode).send({ error: err.print() });
};
