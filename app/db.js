const Sequelize = require('sequelize')
const sequelize = new Sequelize('user_microservice', 'root', 'secret', {
    host: 'mysql',
    dialect: 'mysql',
  });
module.exports = sequelize