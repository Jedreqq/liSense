const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../util/database') 

const Event = sequelize.define('event', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: { //completed, not completed
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = Event;