const Sequelize = require('sequelize')
const sequelize = require('../db.js');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./userModel');

module.exports = db