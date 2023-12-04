const Sequelize = require('sequelize')
const db = require('../db.js')

// Modèle Sequelize pour la table 'users'
const User = db.define('User', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
          isEmail: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    shippingAddress: {
      type: Sequelize.STRING,
    },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // Définit la valeur par défaut à 'false'
    },
    password: {
      type: Sequelize.STRING,
    },
  });


module.exports = User;
