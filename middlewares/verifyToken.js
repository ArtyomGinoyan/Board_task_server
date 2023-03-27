const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/auth.config');
const { refreshtoken: Refreshtoken } = db;

const verifyToken = async (req, res, next) => {
	const access_token = req.cookies.access_token;
	if (!access_token) {
		return res.status(401).send('Access token is required');
	}
	const refresh_token = req.cookies.refresh_token;
	if (!refresh_token) {
		return res.status(401).send('Refresh token is required');
	}
	try {
		try {
			jwt.verify(access_token, config.secret, (err, decoded) => {
				if (err) {
					if (err.name === 'JsonWebTokenError') {
						console.log('Invalid token');
						throw new Error(err.name);
					} else if (err.name === 'TokenExpiredError') {
						console.log('Token expired');
						throw new Error(err.name);
					} else {
						console.log('Unknown error');
					}
				}
				req.userId = decoded.id;
			});
		} catch (error) {
			if (error.message === 'JsonWebTokenError') {
				return res.status(401).send('Access token is invalid');
			} else {
				throw new Error(error.message);
			}
		}

		const refreshToken = await Refreshtoken.findOne({
			where: {
				token: refresh_token,
			},
		});
		if (!refreshToken) {
			res.clearCookie('access_token');
			res.clearCookie('refresh_token');
			return res.status(401).send('Invalid refresh token');
		}
		if (refreshToken.userId !== req.userId) {
			return res.status(401).send('Invalid refresh token');
		}
		next();
	} catch (error) {
		const refreshToken = await Refreshtoken.findOne({
			where: {
				token: refresh_token,
			},
		});
		if (!refreshToken) {
			res.clearCookie('access_token');
			res.clearCookie('refresh_token');
			return res.status(401).send('Invalid refresh token');
		}

		try {
			jwt.verify(refresh_token, config.secret, (err, decoded) => {
				if (err) {
					if (err.name === 'JsonWebTokenError') {
						console.log('Invalid token');
						throw new Error('Refresh token is invalid');
					} else if (err.name === 'TokenExpiredError') {
						console.log('Token expired');
						throw new Error('Refresh token is expired');
					} else {
						console.log('Unknown error');
					}
				}
				req.userId = decoded.id;
			});
			if (refreshToken.userId !== req.userId) {
				return res.status(401).send('Invalid refresh token');
			}
			// Generate a new access token and send it back to the client
			const newAccessToken = jwt.sign(
				{
					id: req.userId,
					exp: Math.round(new Date(Date.now()) / 1000) + 30,
				},
				config.secret
			);
			res.cookie('access_token', newAccessToken, { httpOnly: true });
			next();
			return;
		} catch (err) {
			return res.status(401).send('Invalid refresh token');
		}
	}
};

module.exports = { verifyToken };
