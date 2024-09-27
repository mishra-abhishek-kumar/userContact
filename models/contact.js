"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class contact extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			contact.hasMany(models.information, {
				foreignKey: "contact_id",
				as: "information",
			});
			contact.belongsTo(models.user, {
				foreignKey: "user_id",
				as: "user",
			});
		}
	}
	contact.init(
		{
			contactName: DataTypes.STRING,
			phoneNumber: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "contact",
			underscored: true,
			paranoid: true,
		}
	);
	return contact;
};
