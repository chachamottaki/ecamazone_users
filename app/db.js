const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.TEST_DB_NAME || 'user_microservice',
  process.env.TEST_DB_USER || 'root',
  process.env.TEST_DB_PASSWORD || 'secret',
  // process.env.TEST_DB_PASSWORD || 'root',

  

  {
    host: process.env.TEST_DB_HOST || 'mysql-service',
    // host: process.env.TEST_DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.TEST_DB_PORT || 3306
  }
);
module.exports = sequelize;
