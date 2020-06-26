const crypto = require('crypto');

class Util {
  static getRequriedKey(obj, arr) {
    const cloneObj = { ...obj };
    Object.keys(cloneObj).forEach(key => {
      if (arr.indexOf(key) < 0) {
        delete cloneObj[key];
      }
    });
    return cloneObj;
  }

  static equalsIgnoreCase(compare_str1, compare_str2) {
    return compare_str1.localeCompare(compare_str2, undefined, {
      sensitivity: "base"
    }) === 0
      ? true
      : false;
  }

  static getDateToStringTime(strTime) {
    if (strTime.length === 14) {
      var year = strTime.substr(0, 4);
      var month = strTime.substr(4, 2) - 1;
      var day = strTime.substr(6, 2);
      var hour = strTime.substr(8, 2);
      var min = strTime.substr(10, 2);
      var sec = strTime.substr(12, 2);

      return new Date(year, month, day, hour, min, sec);
    }
    throw new Error(strTime + " is not format string time!");
  }

  static term(date1, date2) {
    if (!date1 instanceof Date) {
      throw new Error(date1 + " is not format Date() format!");
    }
    if (!date2 instanceof Date) {
      throw new Error(date2 + " is not format Date() format!");
    }
    const diff = date1.getTime() - date2.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }

  static merge(...args) {
    let clone = {};
    Array.prototype.slice.call(arguments).forEach(element => {
      args.forEach(element => {
        clone = { ...clone, ...element };
      });
    });
    return clone;
  }

  static encryptData(key, iv, plaintext) {
    if (iv.length < 16) {
      iv = iv.padStart(16, 0);
    } else {
      iv = iv.substr(0, 16);
    }

    const hashKey = crypto.createHash('md5').update(key).digest('hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', hashKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  static decryptData(key, iv, encryptedtext) {
    if (iv.length < 16) {
      iv = iv.padStart(16, 0);
    } else {
      iv = iv.substr(0, 16);
    }

    const hashKey = crypto.createHash('md5').update(key).digest('hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', hashKey, iv);
    let decrypted = decipher.update(encryptedtext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = Util;
