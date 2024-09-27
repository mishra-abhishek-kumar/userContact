"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class information extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			information.belongsTo(models.contact, {
				foreignKey: "contact_id",
				as: "contact",
			});
		}
	}
	information.init(
		{
			address: DataTypes.STRING,
			companyName: DataTypes.STRING,
			email: DataTypes.STRING,
			dob: DataTypes.STRING,
			contactId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "information",
			underscored: true,
			paranoid: true,
		}
	);
	return information;
};
