const fs = require('fs');
const rimraf = require('rimraf');
const db = require('../models');
const { card: Card, role: Role, file: File } = db;
const { updateCardPositions } = require('./cardsUpdate.controller');

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
		await File.destroy({
			where: {
				cardId: id,
			},
		});
		const card = await Card.destroy({
			where: {
				id: id,
			},
		});
		if (!card) {
			res.status(400).send({ message: 'remove card failed' });
		}
		const directoryPath = `${__basedir}/resources/static/assets/uploads/card${id}`;
		if (fs.existsSync(directoryPath)) {
			rimraf(directoryPath, { recursive: true }, (err) => {
				if (err) {
					console.log(err);
					throw err;
				}
				// Directory has been deleted
				console.log('Directory deleted successfully!');
			});
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
