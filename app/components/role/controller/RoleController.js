const { StatusCodes } = require("http-status-codes");
const RoleService = require("../service/RoleService");

class RoleController {
	constructor() {
		this.roleService = new RoleService();
	}

	async createRole(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside createRole`);

			const newRole = await this.roleService.createRole(
				settingsConfig,
				req.body
			);

			res.status(StatusCodes.CREATED).json(newRole);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getAllRole(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getAllRole`);
			const queryParams = req.query;
			const { count, rows } = await this.roleService.getAllRole(
				settingsConfig,
				queryParams
			);
			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);
		} catch (error) {
			next(error);
		}
	}

	async updateRole(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside updateRole`);

			const { roleId } = req.params;
			const role = await this.roleService.getRoleById(
				settingsConfig,
				roleId,
				req.query
			);

			if (role.length == 0) {
				throw new Error("Role not found!");
			}

			const [roleUpdated] = await this.roleService.updateRole(
				settingsConfig,
				roleId,
				req.body
			);

			if (roleUpdated == 0) {
				throw new Error("Could Not Update role");
			}

			res.status(StatusCodes.OK).json("ROle Updated");
			return;
		} catch (error) {
			next(error);
		}
	}

    async deleteRole(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside deleteRole`);

			const { roleId } = req.params;
			const role = await this.roleService.getRoleById(
				settingsConfig,
				roleId,
				req.query
			);

			if (role.length == 0) {
				throw new Error("Role Not Found!");
			}

			const roleDeleted = await this.roleService.deleteRole(
				settingsConfig,
				roleId
			);

			if (!roleDeleted) {
				throw new Error("Could Not Delete role");
			}
			res.status(StatusCodes.OK).json("Role Deleted");
			return;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new RoleController();
