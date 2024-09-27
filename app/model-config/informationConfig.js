const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");


class InformationConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
            address: "address",
            companyName: "companyName",
            email: "email",
            dob: "dob",
            contactId: "contactId"
		});
		this.model = db.information;
		this.modelName = db.information.name;
		this.tableName = db.information.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			address: this.model.rawAttributes[this.fieldMapping.address].field,
			companyName: this.model.rawAttributes[this.fieldMapping.companyName].field,
			email: this.model.rawAttributes[this.fieldMapping.email].field,
			dob: this.model.rawAttributes[this.fieldMapping.dob].field,
			contactId: this.model.rawAttributes[this.fieldMapping.contactId].field,
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

		// this.associations = Object.freeze({
		// 	accountFilter: "accountFilter",
		// });
	}
}
const informationConfig = new InformationConfig();
// deepFreeze(userConfig)

module.exports = informationConfig;
