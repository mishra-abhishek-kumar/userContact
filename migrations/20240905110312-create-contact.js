"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("contacts", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			contact_name: {
				type: Sequelize.STRING,
			},
			phone_number: {
				type: Sequelize.STRING,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "users",
					},
				},
				key: "id",
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("contacts");
	},
};
