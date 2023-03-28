module.exports = (sequelize, DataTypes) => {
	const Files = sequelize.define(
		'file',
		{
			file_name: {
				type: DataTypes.STRING,
			},
		},
		{ timestamps: false }
	);

	return Files;
};
