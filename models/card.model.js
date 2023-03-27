module.exports = (sequelize, DataTypes) => {
	const Card = sequelize.define(
		'card',
		{
			content: {
				type: DataTypes.STRING,
			},
			name: {
				type: DataTypes.STRING,
			},
			position: {
				type: DataTypes.INTEGER,
			},
		},
		{ timestamps: false }
	);

	return Card;
};
