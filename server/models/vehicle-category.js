const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const VehicleCategory = sequelize.define('vehicleCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

module.exports = VehicleCategory;