require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5506;
const corsOptions = {
	origin: `http://localhost:3000`,
	credentials: true,
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

//models
const db = require('./models');
const Role = db.role;
const User = db.user;

// force: true will drop the table if it already exists
db.sequelize
	.sync({ force: true })
	.then(() => {
		console.log('db has been re-sync');
		initial();
	})
	.catch((err) => {
		console.log(err);
		console.log('Error whyle syncing table & model');
	});

//routes
require('./routes/auth.routes')(app);
require('./routes/card.routes')(app);
require('./routes/board.routes')(app);
require('./routes/owner.routes')(app);
require('./routes/column.routes')(app);

app.all('*', (req, res) => res.status(404).send({ error: `URL ${req.url} not found` }));

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));

async function initial() {
	try {
		const password = process.env.USER_PASSWORD;
		const name = process.env.USER_NAME;
		console.log(name, password);
		const email = process.env.USER_EMAIL;
		const data = {
			name,
			email,
			password: await bcrypt.hash(password, 10),
		};
		const user = await User.create(data);
		await Role.create({
			id: 1,
			name: 'user',
		});
		await Role.create({
			id: 2,
			name: 'admin',
		});
		const setRoles = await user.setRoles([2]);
		if (setRoles) console.log(setRoles, 'registered succesfuly....');
	} catch (err) {
		console.log(err.message, 'error');
	}
}
