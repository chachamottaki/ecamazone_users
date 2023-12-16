const Sequelize = require('sequelize')
const sequelize = require('../db.js');

const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.User = require('./userModel');
// db.Address = require('./addressModel');
// Importez les modèles en passant `sequelize` et `Sequelize`
db.User = require('./userModel')(sequelize, Sequelize);
db.Address = require('./addressModel')(sequelize, Sequelize);


// Relations
db.User.hasMany(db.Address);
db.Address.belongsTo(db.User);

module.exports = db







