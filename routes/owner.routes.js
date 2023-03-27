const { verifyToken } = require('../middlewares/verifyToken');
const { getOwnerData } = require('../controllers/owner.controller');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});

	app.get('/card/owner/:id', verifyToken, getOwnerData);
};
