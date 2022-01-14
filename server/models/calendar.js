const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../util/database') 

const Calendar = sequelize.define("calendar", {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Calendar;