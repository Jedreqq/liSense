const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const roles = ["student", "instructor", "owner", "admin"];

const User = sequelize.define("user", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(roles),
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "New user",
  },
  BranchRequestId: {
    type: DataTypes.INTEGER,
  },
  activeBranchId: {
    type: DataTypes.INTEGER,
  }
});

module.exports = User;
