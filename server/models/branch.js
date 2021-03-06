const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");
const School = require("./school");

const Branch = sequelize.define("branch", {
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
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

School.hasMany(Branch);
Branch.belongsTo(School);

module.exports = Branch;
