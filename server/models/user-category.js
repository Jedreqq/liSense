const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const UserCategory = sequelize.define('userCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

module.exports = UserCategory;