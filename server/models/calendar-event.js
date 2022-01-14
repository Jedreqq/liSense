const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const CalendarEvent = sequelize.define('calendarEvent', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = CalendarEvent