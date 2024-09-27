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
const contactConfig = require("../../../model-config/contactConfig");

class ContactService {
	constructor() {}

	#associationMap = {
		information: {
			model: informationConfig.model,
			as: "information",
		},
	};

	createAssociation(includeQuery) {
		let association = [];

		if (!Array.isArray(includeQuery)) {
			includeQuery = [includeQuery];
		}

		if (includeQuery?.includes(contactConfig.associations.information)) {
			association.push(this.#associationMap.information);
		}
	}

	async createcontact(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createContact`);

			const data = await contactConfig.model.create(body, { transaction: t });
			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getAllContact(settingsConfig, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getAllContact`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: contactConfig.fieldMapping.id,
				contactName: contactConfig.fieldMapping.contactName,
				phoneNumber: contactConfig.fieldMapping.phoneNumber,
				userId: contactConfig.fieldMapping.userId,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);

			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery);
			}

			const data = await contactConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, contactConfig.filters),
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

    async getContactById(settingsConfig, contactId, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getContactById`);

			const includeQuery = queryParams.include || [];
			let associations = [];
			const attributesToReturn = {
				id: contactConfig.fieldMapping.id,
				contactName: contactConfig.fieldMapping.contactName,
                phoneNumber: contactConfig.fieldMapping.phoneNumber,
                userId: contactConfig.fieldMapping.userId,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery, selectArray);
			}

			const data = await contactConfig.model.findAll({
				...parseFilterQueries(queryParams, contactConfig.filters, { id: contactId }),
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
    
    async updateContact(settingsConfig, contactId, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside updateContact`);

			for (const [parameter, newValue] of Object.entries(body)) {
				let up = undefined;
				switch (parameter) {
					case "contactName":
						up = await contactConfig.model.update(
							{ contactName: newValue },
							{ where: { id: contactId }, transaction: t }
						);
						await t.commit();
						return up;
					case "phoneNumber":
						up = await contactConfig.model.update(
							{ phoneNumber: newValue },
							{ where: { id: contactId }, transaction: t }
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

    async deleteContact(settingsConfig, contactId) {
        const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside deleteUser`);

			const deletedContact = await contactConfig.model.destroy({
				where: { id: contactId },
				transaction: t,
			});

			if (deletedContact === 0) {
				throw new Error(`User with ID ${contactId} not found`);
			}

			await t.commit();
			return true;
		} catch (error) {
			await t.rollback();
			throw error;
		}
    }
}

module.exports = ContactService;
