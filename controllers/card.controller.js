const db = require('../models');
const { updateCardPositions } = require('./cardsUpdate.controller');
const { card: Card, role: Role } = db;

const createCard = async (req, res) => {
	try {
		if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
			res.status(400).send({ message: 'Please write required field' });
			return;
		}
		const { columnId, userId, content, position } = req.body;

		const card = await Card.create({ content, columnId, userId, position });
		res.status(200).send(card);
	} catch (error) {
		res.status(500).send(error);
	}
};

const removeCard = async (req, res) => {
	try {
		const { id, position, columnId } = req.params;
		const card = await Card.destroy({
			where: {
				id: id,
			},
		});
		if (!card) {
			res.status(400).send({ message: 'remove card failed' });
		}
		// Update the positions of the remaining cards in the source column
		await updateCardPositions(columnId, position, 'source', id);

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const updateCard = async (req, res) => {
	try {
		if ((req.body.constructor === Object && Object.keys(req.body).length === 0) || !req.params.id) {
			res.status(400).send({ message: 'Please provide all required fields' });
			return;
		}
		const { name, content } = req.body;
		const id = req.params.id;

		await Card.update(
			{ name, content },
			{
				where: {
					id: id,
				},
			}
		);
		const card = await Card.findByPk(id);
		res.status(200).send(card);
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
	createCard,
	removeCard,
	updateCard,
};
