const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.TEST_DB_NAME || 'user_microservice',
  process.env.TEST_DB_USER || 'root',
  process.env.TEST_DB_PASSWORD || 'secret',
  {
    host: process.env.TEST_DB_HOST || 'mysql-service',
    dialect: 'mysql',
    port: process.env.TEST_DB_PORT || 3306
  }
);

module.exports = sequelize;
