const { verifyToken } = require('../middlewares/verifyToken');
const { getBoardData } = require('../controllers/board.controller');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});

	app.get('/board/data', verifyToken, getBoardData);
};
