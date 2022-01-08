const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Comment = sequelize.define("comment", {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Comment;