const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class RoleConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			role: "role",
		});
		this.model = db.role;
		this.modelName = db.role.name;
		this.tableName = db.role.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			role: this.model.rawAttributes[this.fieldMapping.role].field,
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
			role: (role) => {
				validateStringLength(role, "role", undefined, 255);
				return {
					[this.fieldMapping.role]: {
						[Op.like]: `%${role}%`,
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
			user: "user",
		});
	}
}
const roleConfig = new RoleConfig();
// deepFreeze(userConfig)

module.exports = roleConfig;
