const db = require('../models');
const { column: Column, card: Card } = db;

const getBoardData = async (req, res) => {
	try {
		const data = await Column.findAll({
			include: [
				{
					model: Card,
					required: false,
					duplicating: false,
					subQuery: false,
				},
			],
			order: [[{ model: Card }, 'position', 'ASC']],
		});
		const finalData = data.sort((a, b) => a.id - b.id);
		res.status(200).send(finalData);
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
	getBoardData,
};
