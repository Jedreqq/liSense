const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const categories = ["A", "A1", "A2", "B", "B1", "C", "C1", "D", "D1", "B+E", "C+E", "D+E", "T"];

const Category = sequelize.define("category", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  type: {
    type: DataTypes.ENUM(categories),
    allowNull: false,
  },
});

module.exports = Category;

//const categories = ["A", "A1", "A2", "B", "B1", "C", "C1", "D", "D1", "B+E", "C+E", "D+E", "T"];