const Sequelize = require('sequelize')
const sequelize = new Sequelize('user_microservice', 'root', 'root', {
    host: 'brave_tharp',
    dialect: 'mysql',
  });
module.exports = sequelize