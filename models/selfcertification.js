'use strict'

const Sequelize = require('sequelize');
const { selfCert } = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const SelfCertification = sequelize.define(
    "SelfCertification",
    {
      id: {
        comment: "unique id",
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(selfCert),              // ['sms', 'email'],
        allowNull: false,
        defaultValue: Object.values(selfCert)[0],     // 'sms'
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,  
      },
      mobile: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          name: 'idx_uuid_createdAt',
          unique: true,
          fields: [
            { attribute: 'uuid', order: 'ASC' },
            { attribute: 'createdAt', order: 'DESC' },
          ],
        },  
      ],      
      tableName: "tb_selfcertifications",
      timestamps: false,
    }
  );

  return SelfCertification;
};
