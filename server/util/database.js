const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "liSense_mySQL_DB",
  "root",
  "PiotrPytlakSuper",
  { host: "localhost", dialect: "mysql" }
);

module.exports = sequelize;
