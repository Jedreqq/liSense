const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Payment = sequelize.define("payment", {
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "unpaid",
  },
});

module.exports = Payment;
