const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class UserConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			name: "name",
			email: "email",
		});
		this.model = db.user;
		this.modelName = db.user.name;
		this.tableName = db.user.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			name: this.model.rawAttributes[this.fieldMapping.name].field,
			email: this.model.rawAttributes[this.fieldMapping.email].field,
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
			contact: "contact",
			role: "role",
		});
	}
}
const userConfig = new UserConfig();
// deepFreeze(userConfig)

module.exports = userConfig;
