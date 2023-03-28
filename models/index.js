const config = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

// for local development
// const sequelize = new Sequelize('board', 'root', 'root12345', {
// 	host: 'localhost',
// 	dialect: config.dialect,
// });

const sequelize = new Sequelize('railway', process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	port: process.env.DB_PORT,
	operatorsAliases: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, DataTypes);
db.card = require('./card.model')(sequelize, DataTypes);
db.file = require('./files.model')(sequelize, DataTypes);
db.role = require('./roles.model')(sequelize, DataTypes);
db.column = require('./column.model')(sequelize, DataTypes);
db.refreshtoken = require('./refreshtoken.model')(sequelize, DataTypes);

db.role.belongsToMany(db.user, {
	through: 'user_roles',
});
db.user.belongsToMany(db.role, {
	through: 'user_roles',
});

db.refreshtoken.belongsTo(db.user);

db.column.hasMany(db.card);
db.card.belongsTo(db.column);

db.card.hasMany(db.file);
db.file.belongsTo(db.card);

db.user.hasMany(db.card);
db.card.belongsTo(db.user);

module.exports = db;
