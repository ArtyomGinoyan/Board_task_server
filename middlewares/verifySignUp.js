const db = require('../models');
const User = db.user;

const checkDuplicateNameOrEmail = async (req, res, next) => {
	try {
		const { email, name, surname } = req.body;
		const userName = await User.findOne({
			where: { name: name },
		});
		if (userName) {
			res.status(404).send({
				message: 'Failed! username is already in use!',
			});
			return;
		}
		const emailcheck = await User.findOne({
			where: { email: email },
		});
		if (emailcheck) {
			res.status(404).send({
				message: 'Failed! Email is already in use!',
			});
			return;
		}
		next();
	} catch (error) {
		res.json(500).send(error);
	}
};

module.exports = {
	checkDuplicateNameOrEmail,
};
