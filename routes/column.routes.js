const { verifyToken } = require('../middlewares/verifyToken');
const { createColumn, updateColumn } = require('../controllers/column.controller');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});
	app.post('/column/create', verifyToken, createColumn);
	app.put('/column/update/:id', verifyToken, updateColumn);
};
