const { Sequelize, DataTypes, ARRAY } = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define("message", {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    messageContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    received: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Message;