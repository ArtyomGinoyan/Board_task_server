const db = require('../models');

const { user: User } = db;

const getOwnerData = async (req, res) => {
	try {
		const id = req.params.id;
		const data = await User.findOne({
			where: {
				id: id,
			},
			attributes: ['id', 'name', 'email'],
		});
		res.status(200).send(data);
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
	getOwnerData,
};
