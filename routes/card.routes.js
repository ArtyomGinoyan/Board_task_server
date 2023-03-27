const { verifyToken } = require('../middlewares/verifyToken');
const { accessForAction } = require('../middlewares/accessForAction');
const { moveCard } = require('../controllers/cardsUpdate.controller');
const { createCard, removeCard, updateCard } = require('../controllers/card.controller');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});

	app.put('/card/moved', verifyToken, accessForAction, moveCard);
	app.post('/card/create', verifyToken, createCard);
	app.put('/card/update/:id', verifyToken, accessForAction, updateCard);
	app.delete('/card/remove/:id/:position/:columnId', verifyToken, accessForAction, removeCard);
};
