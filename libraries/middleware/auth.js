const { decodeToken } = require("../helpers/token");
const { ClientError } = require("../error");
const deferrors = require('../error/define')
const url = require("url");
const util = require("../../libraries/helpers/util");

const free = [
  {
    method: 'POST',
    path: "/users", 
  },
  {
    method: 'GET',
    path: "/users/signin", 
  }
];

exports.auth = async (req, res, next) => {
  try {
      let url_parse = url.parse(req.url, true);
      let pathname = url_parse.pathname;
    
      let include = false;
      free.forEach((key) => {
        if (util.equalsIgnoreCase(key.method, req.method) && pathname.indexOf(key.path) > -1) {
          include = true;
        }
      });
    
      if (include) {
        next();
      } else {
        const token = req.body.token || req.query.token || req.headers["access-token"];
        console.log('accessToken', token);
        if (!token) {
          throw new ClientError(deferrors.no_token_provided);
        }
        const decoded = decodeToken(token);
        req.decoded = decoded;
        next();
      }
  } catch (error) {
    next(error);
  }
};
