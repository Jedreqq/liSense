const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Vehicle = sequelize.define('vehicle', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  brand: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  model: {
      type: DataTypes.STRING,
      allowNull: false
  },
  year: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  registrationPlate: {
      type: DataTypes.STRING,
      allowNull: false
  },
  VehicleCategories: {
    type: DataTypes.VIRTUAL,
  }
});

module.exports = Vehicle;