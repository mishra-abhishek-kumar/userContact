"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class role extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			role.belongsToMany(models.user, {
				through: "users_roles",
			});
		}
	}
	role.init(
		{
			role: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "role",
			underscored: true,
			paranoid: true,
		}
	);
	return role;
};
