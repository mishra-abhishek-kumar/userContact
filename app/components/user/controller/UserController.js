const { StatusCodes } = require("http-status-codes");
const UserService = require("../service/UserService");

class UserController {
	constructor() {
		this.userService = new UserService();
	}

	async createUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside createUser`);
			const newUser = await this.userService.createUser(
				settingsConfig,
				req.body
			);
			res.status(StatusCodes.CREATED).json(newUser);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getAllUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getAllUser`);
			const queryParams = req.query;
			const { count, rows } = await this.userService.getAllUsers(
				settingsConfig,
				queryParams
			);
			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);
		} catch (error) {
			next(error);
		}
	}

	async updateUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside updateUser`);

			const { userId } = req.params;
			const user = await this.userService.getUserById(
				settingsConfig,
				userId,
				req.query
			);

			if (user.length == 0) {
				throw new Error("User Not Found!");
			}

			const [userUpdated] = await this.userService.updateUser(
				settingsConfig,
				userId,
				req.body
			);

			if (userUpdated == 0) {
				throw new Error("Could Not Update user");
			}
			res.status(StatusCodes.OK).json("User Updated");
			return;
		} catch (error) {
			next(error);
		}
	}

	async deleteUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside deleteUser`);

			const { userId } = req.params;
			const user = await this.userService.getUserById(
				settingsConfig,
				userId,
				req.query
			);

			if (user.length == 0) {
				throw new Error("User Not Found!");
			}

			const userDeleted = await this.userService.deleteUser(
				settingsConfig,
				userId
			);

			if (!userDeleted) {
				throw new Error("Could Not Delete user");
			}
			res.status(StatusCodes.OK).json("User Deleted");
			return;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
