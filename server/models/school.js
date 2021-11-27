const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const School = sequelize.define('school', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = School;