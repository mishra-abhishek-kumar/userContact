"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("user_roles", {
			user_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "users",
					key: "id",
				},
				primaryKey: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			role_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "roles",
					key: "id",
				},
				primaryKey: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
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
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
