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
const informationConfig = require("../../../model-config/informationConfig");

class InformationService {
	constructor() {}

	async createInformation(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createUser`);

			const data = await informationConfig.model.create(body, {
				transaction: t,
			});
			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getAllInformation(settingsConfig, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getAllUsers`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: informationConfig.fieldMapping.id,
				address: informationConfig.fieldMapping.address,
				companyName: informationConfig.fieldMapping.companyName,
				email: informationConfig.fieldMapping.email,
				dob: informationConfig.fieldMapping.dob,
				contactId: informationConfig.fieldMapping.contactId,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);

			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			// if (includeQuery) {
			// 	associations = this.createAssociation(includeQuery);
			// }

			const data = await informationConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, informationConfig.filters),
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

	async getInformationById(settingsConfig, informationId, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getUserById`);

			const includeQuery = queryParams.include || [];
			let associations = [];
			const attributesToReturn = {
				id: informationConfig.fieldMapping.id,
				address: informationConfig.fieldMapping.address,
				companyName: informationConfig.fieldMapping.companyName,
				email: informationConfig.fieldMapping.email,
				dob: informationConfig.fieldMapping.dob,
				contactId: informationConfig.fieldMapping.contactId,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			// if (includeQuery) {
			// 	associations = this.createAssociation(includeQuery, selectArray);
			// }

			const data = await informationConfig.model.findAll({
				...parseFilterQueries(queryParams, informationConfig.filters, {
					id: informationId,
				}),
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

	async updateInformation(settingsConfig, informationId, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside updateInformation`);

			for (const [parameter, newValue] of Object.entries(body)) {
				let up = undefined;
				switch (parameter) {
					case "address":
						up = await informationConfig.model.update(
							{ address: newValue },
							{ where: { id: informationId }, transaction: t }
						);
						await t.commit();
						return up;
					case "companyName":
						up = await informationConfig.model.update(
							{ companyName: newValue },
							{ where: { id: informationId }, transaction: t }
						);
						await t.commit();
						return up;
					case "email":
						up = await informationConfig.model.update(
							{ email: newValue },
							{ where: { id: informationId }, transaction: t }
						);
						await t.commit();
						return up;
					case "dob":
						up = await informationConfig.model.update(
							{ dob: newValue },
							{ where: { id: informationId }, transaction: t }
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

	async deleteInformation(settingsConfig, informationId) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside deleteUser`);

			const deletedInformation = await informationConfig.model.destroy({
				where: { id: informationId },
				transaction: t,
			});

			if (deletedInformation === 0) {
				throw new Error(`User with ID ${informationId} not found`);
			}

			await t.commit();
			return true;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}

module.exports = InformationService;
