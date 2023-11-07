const Sequelize = require('sequelize')
const db = require('../db.js')

// Modèle Sequelize pour la table 'users'
const User = db.define('User', {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    paymentMethod: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  });


module.exports = User;
