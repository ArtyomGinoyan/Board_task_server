const db = require('../models');
const config = require('../config/auth.config');

const { user: User, column: Column } = db;

const createColumn = async (req, res) => {
	try {
		if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
			res.status(400).send({ message: 'Please write column name' });
			return;
		}
		const { title } = req.body;

		const column = await Column.create({ title });
		res.status(200).send(column);
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateColumn = async (req, res) => {
	try {
		if ((req.body.constructor === Object && Object.keys(req.body).length === 0) || !req.params.id) {
			res.status(400).send({ message: 'Please provide all required fields' });
			return;
		}
		const { title } = req.body;
		const id = req.params.id;

		await Column.update(
			{ title },
			{
				where: {
					id: id,
				},
			}
		);
		const column = await Column.findByPk(id);
		res.status(200).send(column);
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
	createColumn,
	updateColumn,
};
