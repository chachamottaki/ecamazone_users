const Sequelize = require('sequelize')
const sequelize = new Sequelize('user_microservice', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
  });
module.exports = sequelize