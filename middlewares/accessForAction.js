const db = require('../models');
const { user: User, column: Column, card: Card, role: Role } = db;

const accessForAction = async (req, res, next) => {
	try {
		const userId = req.userId;
		const user = await User.findOne({
			where: {
				id: userId,
			},
			include: [
				{
					model: Role,
					required: false,
					duplicating: false,
					subQuery: false,
				},
			],
		});

		if (user.roles[0].name === 'Admin' || user.id === userId) {
			next();
			return;
		}
		res.status(400).send({
			message: "Failed!You can't do this action!",
		});
		return;
	} catch (error) {
		res.json(500).send(error);
	}
};

module.exports = {
	accessForAction,
};
