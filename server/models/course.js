const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Course = sequelize.define("course", {
  _id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dayOfStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  theoryClasses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  practicalClasses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Available",
  },
});

module.exports = Course;
