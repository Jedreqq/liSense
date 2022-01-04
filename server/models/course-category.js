const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const CourseCategory = sequelize.define('courseCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

module.exports = CourseCategory;