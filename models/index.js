const config = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
// 	host: config.HOST,
// 	dialect: config.dialect,
// });

const sequelize = new Sequelize('railway', process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	port: process.env.DB_PORT,
	// operatorsAliases: false,
	// pool: {
	//     max: config.pool.max,
	//     min: config.pool.min,
	//     acquire: config.pool.acquire,
	//     idle: config.pool.idle,
	// },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, DataTypes);
db.card = require('./card.model')(sequelize, DataTypes);
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

db.user.hasMany(db.card);
db.card.belongsTo(db.user);

module.exports = db;
