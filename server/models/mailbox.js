const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Mailbox = sequelize.define("mailbox", {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },


});

module.exports = Mailbox;