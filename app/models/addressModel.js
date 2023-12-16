const Sequelize = require('sequelize')
const db = require('../db.js')

// const Address = db.define('Address', {
//     street: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     city: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     zipCode: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     country: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     // autres champs nécessaires
// });


// module.exports = Address;



module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // autres champs nécessaires
    });
  
    return Address;
  };