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

const userConfig = require("../../../model-config/userConfig");
const contactConfig = require("../../../model-config/contactConfig");
const { includes } = require("lodash");
const informationConfig = require("../../../model-config/informationConfig");
const roleConfig = require("../../../model-config/roleConfig");

class RoleService {
	constructor() {}

	#associationMap = {
		user: {
			model: userConfig.model,
			as: "user",
			include: {
				model: contactConfig.model,
				as: "contact",
				include: {
					model: informationConfig.model,
					as: "information",
				},
			},
		},
	};

	createAssociation(includeQuery) {
		let association = [];

		if (!Array.isArray(includeQuery)) {
			includeQuery = [includeQuery];
		}

		if (includeQuery?.includes(roleConfig.associations.user)) {
			association.push(this.#associationMap.user);
		}
	}

	async createRole(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createRole`);

			const data = await roleConfig.model.create(body, { transaction: t });
			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getAllRole(settingsConfig, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getAllRole`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: roleConfig.fieldMapping.id,
				role: roleConfig.fieldMapping.role,
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

			const data = await roleConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, roleConfig.filters),
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

	async getRoleById(settingsConfig, roleId, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getRoleById`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: roleConfig.fieldMapping.id,
				role: roleConfig.fieldMapping.role,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery, selectArray);
			}

			const data = await roleConfig.model.findAll({
				...parseFilterQueries(queryParams, roleConfig.filters, { id: roleId }),
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

    async updateRole(settingsConfig, roleId, body) {
        const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside updateUser`);

            console.log("body====>", body)

			for (const [parameter, newValue] of Object.entries(body)) {
				let up = undefined;
				switch (parameter) {
					case "role":
                        console.log("parameters===>", parameter)
						up = await roleConfig.model.update(
							{ role: newValue },
							{ where: { id: roleId }, transaction: t }
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

    async deleteRole(settingsConfig, roleId) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside deleteUser`);

			const deletedRole = await roleConfig.model.destroy({
				where: { id: roleId },
				transaction: t,
			});

			if (deletedRole === 0) {
				throw new Error(`User with ID ${roleId} not found`);
			}

			await t.commit();
			return true;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}

module.exports = RoleService;
