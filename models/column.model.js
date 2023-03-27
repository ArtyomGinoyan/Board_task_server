module.exports = (sequelize, DataTypes) => {
	const Column = sequelize.define(
		'column',
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false }
	);

	return Column;
};
