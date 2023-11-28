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
      // Vous pouvez diviser en plusieurs champs (rue, ville, code postal, pays) si nécessaire
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // Définit la valeur par défaut à 'false'
},
//   billingAddress: {
//       type: Sequelize.STRING,
//       // Vous pouvez diviser en plusieurs champs si nécessaire
//   },
//   cardHolderName: {
//     type: Sequelize.STRING,
// },
// cardLastFourDigits: {
//     type: Sequelize.STRING,
//     validate: {
//         len: [4, 4],
//     },
// },
// cardExpirationDate: {
//     type: Sequelize.STRING,
//     // Valider le format de la date si nécessaire
// },
// cardType: {
//     type: Sequelize.STRING,
//     // Visa, MasterCard, etc.
// },
    password: {
      type: Sequelize.STRING,
    },
  });


module.exports = User;
