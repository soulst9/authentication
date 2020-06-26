'use strict'

const { oauth2 } = require('../config/constants');
const util = require('../libraries/helpers/util');
const common = require('../config/env/common');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      oauthType: {
        type: DataTypes.ENUM,
        values: Object.values(oauth2),                // ['kakao', 'facebook'],
        allowNull: false,
        defaultValue: Object.values(oauth2)[0],       // 'kakao'
      },
      oauthId: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(16),
      },
      gender: {
        type: DataTypes.ENUM('m', 'f'),
        allowNull: false,
        defaultValue: 'm',
      },  
      email: {
        type: DataTypes.STRING(32),
      },
      point: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },  
      serviceType: {
        type: DataTypes.ENUM('findme', 'lioncat'),
        allowNull: false,
      },
      isSignout: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      indexes: [
        { unique: true, fields: ['uuid'] },
        { unique: true, fields: ['oauthId', 'oauthType'] },
      ],      
      tableName: "tb_users",
      timestamps: true,
    },
  );

  User.prototype.encryptMobile = function(mobile) {
    return util.encryptData(common.secretKey.mobile, this.code, mobile);
  }

  User.prototype.decryptMobile = function(encyptedMobile) {
    return util.decryptData(common.secretKey.mobile, this.code, encyptedMobile)
  }

  // User.beforeCreate(user => user.uuid = uuid());

  // User.associate = function (models) {
  //   models.Discounts.belongsTo(models.Products, {
  //     onDelete: "CASCADE",      // 데이터 무결성
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };

  return User;
};



