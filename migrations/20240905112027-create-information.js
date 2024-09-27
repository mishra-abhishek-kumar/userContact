"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("information", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			address: {
				type: Sequelize.STRING,
			},
			company_name: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			dob: {
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
			contact_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "contacts",
					},
				},
				key: "id",
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("information");
	},
};
