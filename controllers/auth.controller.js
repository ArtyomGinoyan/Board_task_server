const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { validationResult } = require('express-validator');

const { user: User, refreshtoken: RefreshToken } = db;

const signup = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password, admin } = req.body;

		const userStaff = {
			name,
			email,
			password: await bcrypt.hash(password, 10),
		};

		const user = await User.create(userStaff);

		if (!user) {
			return res.status(409).send('Details are not correct');
		}
		if (admin) {
			await user.setRoles([2]);
			return res.status(201).json('user create successfuly');
		}

		await user.setRoles([1]);
		return res.status(201).json('user create successfuly');
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const login = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email: email } });
		if (!user) {
			return res.status(404).send({
				message: 'Authentication failed',
			});
		}
		const passwordIsValid = await bcrypt.compare(password, user.password);

		if (!passwordIsValid) {
			return res.status(404).send({
				message: 'Authentication failed',
			});
		}

		const token = jwt.sign({ id: user.id, exp: Math.round(new Date(Date.now()) / 1000) + 30 }, config.secret);

		let refreshToken = await createToken(user);

		let authorities;
		const roles = await user.getRoles();
		roles.forEach((element) => {
			authorities = element.name.toUpperCase();
		});

		res.cookie('refresh_token', refreshToken, {
			maxAge: 15 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});

		res.cookie('access_token', token, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
		res.status(201).send({
			id: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
			roles: authorities,
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateProfile = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const id = req.params.id;
		const { name, email, oldPassword, newPassword } = req.body;
		const user = await User.findByPk(id);
		if (!user) {
			throw new Error('User not found');
		}

		user.name = name;
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser && existingUser.id !== req.userId) {
			throw new Error('Email address already in use');
		} else {
			user.email = email;
		}
		const passwordIsValid = await bcrypt.compare(oldPassword, user.password);

		if (newPassword && passwordIsValid) {
			user.password = await bcrypt.hash(newPassword, 10);
		}

		await user.save();

		const updatedStaff = await User.findByPk(id);
		const roles = await updatedStaff.getRoles();
		let authorities;
		roles.forEach((element) => {
			authorities = element.name.toUpperCase();
		});
		res.status(200).send({
			id: updatedStaff.id,
			name: updatedStaff.name,
			surname: updatedStaff.surname,
			email: updatedStaff.email,
			roles: authorities,
		});
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
};

const createToken = async (user) => {
	try {
		let expiredAt = new Date();

		let _token = jwt.sign(
			{ id: user.id, exp: Math.round(new Date(Date.now()) / 1000) + 1296000 },
			config.secret
		);

		let refreshToken = await RefreshToken.create({
			token: _token,
			userId: user.id,
			expiryDate: expiredAt.getTime(),
		});
		return refreshToken.token;
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
};

const logout = async (req, res) => {
	try {
		const id = req.params.id;
		await RefreshToken.destroy({
			where: {
				userID: id,
			},
		});
		res.clearCookie('access_token', {
			sameSite: 'none',
			secure: true,
		});
		res.clearCookie('refresh_token', {
			sameSite: 'none',
			secure: true,
		});
		res.status(200).send({ message: 'logout success' });
		return;
	} catch (error) {
		res.status(500).send([{ message: error }]);
	}
};

module.exports = {
	signup,
	login,
	logout,
	updateProfile,
};
