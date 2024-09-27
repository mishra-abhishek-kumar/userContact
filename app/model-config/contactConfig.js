const db = require("../../models");

const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class ContactConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			contactName: "contactName",
			phoneNumber: "phoneNumber",
			userId: "userId",
		});
		this.model = db.contact;
		this.modelName = db.contact.name;
		this.tableName = db.contact.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			contactName:
				this.model.rawAttributes[this.fieldMapping.contactName].field,
			phoneNumber:
				this.model.rawAttributes[this.fieldMapping.phoneNumber].field,
			userId: this.model.rawAttributes[this.fieldMapping.userId].field,
		});

		this.filters = Object.freeze({
			id: (id) => {
				validateUuid(id, "user config");
				return {
					[this.fieldMapping.id]: {
						[Op.eq]: id,
					},
				};
			},
			username: (username) => {
				validateStringLength(username, "username", undefined, 255);
				return {
					[this.fieldMapping.username]: {
						[Op.like]: `%${username}%`,
					},
				};
			},
			name: (name) => {
				validateStringLength(name, "name", undefined, 255);
				return {
					[this.fieldMapping.name]: {
						[Op.like]: `%${name}%`,
					},
				};
			},
			gender: (gender) => {
				validateStringLength(gender, "gender", undefined, 255);
				return {
					[this.fieldMapping.gender]: {
						[Op.like]: `%${gender}%`,
					},
				};
			},
		});

		this.associations = Object.freeze({
			information: "information",
		});
	}
}
const contactConfig = new ContactConfig();
// deepFreeze(userConfig)

module.exports = contactConfig;
