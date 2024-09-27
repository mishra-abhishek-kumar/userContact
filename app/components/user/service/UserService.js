const userConfig = require("../../../model-config/userConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { preloadAssociations } = require("../../../sequelize/association");
const { startTransaction } = require("../../../sequelize/transaction");
const {
	parseFilterQueries,
	parseLimitAndOffset,
	parseSelectFields,
} = require("../../../utils/request");
const contactConfig = require("../../../model-config/contactConfig");
const informationConfig = require("../../../model-config/informationConfig");
const roleConfig = require("../../../model-config/roleConfig");

class UserService {
	constructor() {}

	#associationMap = {
		contact: {
			model: contactConfig.model,
			as: "contact",
			include: {
				model: informationConfig.model,
				as: "information",
			},
		},
		role: {
			model: roleConfig.model,
			as: "role",
		},
	};

	createAssociation(includeQuery) {
		let association = [];

		if (!Array.isArray(includeQuery)) {
			includeQuery = [includeQuery];
		}

		if (includeQuery?.includes(userConfig.associations.contact)) {
			association.push(this.#associationMap.contact);
		}

		if (includeQuery?.includes(userConfig.associations.role)) {
			association.push(this.#associationMap.role);
		}
	}

	async createUser(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createUser`);

			const data = await userConfig.model.create(body, { transaction: t });
			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getAllUsers(settingsConfig, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getAllUsers`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: userConfig.fieldMapping.id,
				name: userConfig.fieldMapping.name,
				email: userConfig.fieldMapping.email,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			console.log("selectedArray ====>", selectArray);

			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
				console.log("selectedArray ====>", selectArray);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery);
			}

			const data = await userConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, userConfig.filters),
				attributes: selectArray,
				...parseLimitAndOffset(queryParams),
				...preloadAssociations(associations),
			});

			await t.commit();

			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getUserById(settingsConfig, userId, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getUserById`);

			const includeQuery = queryParams.include || [];
			let associations = [];
			const attributesToReturn = {
				id: userConfig.fieldMapping.id,
				name: userConfig.fieldMapping.name,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery, selectArray);
			}

			const data = await userConfig.model.findAll({
				...parseFilterQueries(queryParams, userConfig.filters, { id: userId }),
				attributes: selectArray,
				transaction: t,
				...preloadAssociations(associations),
			});

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async updateUser(settingsConfig, userId, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside updateUser`);

			for (const [parameter, newValue] of Object.entries(body)) {
				let up = undefined;
				switch (parameter) {
					case "name":
						up = await userConfig.model.update(
							{ name: newValue },
							{ where: { id: userId }, transaction: t }
						);
						await t.commit();
						return up;
					case "email":
						up = await userConfig.model.update(
							{ email: newValue },
							{ where: { id: userId }, transaction: t }
						);
						await t.commit();
						return up;
					default:
						throw new Error(`Invalid Parameter: ${parameter}`);
				}
			}
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async deleteUser(settingsConfig, userId) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside deleteUser`);

			const deletedUser = await userConfig.model.destroy({
				where: { id: userId },
				transaction: t,
			});

			if (deletedUser === 0) {
				throw new Error(`User with ID ${userId} not found`);
			}

			await t.commit();
			return true;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}

module.exports = UserService;
