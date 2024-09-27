"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			user.hasMany(models.contact, {
				foreignKey: "user_id",
				as: "contact",
			});

			user.belongsToMany(models.role, {
				through: "users_roles",
			});
		}
	}
	user.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "user",
			underscored: true,
			paranoid: true,
		}
	);
	return user;
};
