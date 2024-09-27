const { StatusCodes } = require("http-status-codes");
const InformationService = require("../service/InformationService");

class InformationController {
	constructor() {
		this.InformationService = new InformationService();
	}

	async createInformation(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside createInformation`);
			const newInformation = await this.InformationService.createInformation(
				settingsConfig,
				req.body
			);
			res.status(StatusCodes.CREATED).json(newInformation);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getAllInformation(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getAllInformation`);

			const queryParams = req.query;
			const { count, rows } = await this.InformationService.getAllInformation(
				settingsConfig,
				queryParams
			);

			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);
		} catch (error) {
			next(error);
		}
	}

	async updateInformation(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside updateUser`);

			const { informationId } = req.params;

			const information = await this.InformationService.getInformationById(
				settingsConfig,
				informationId,
				req.query
			);

			console.log("Information ====>", information);

			if (information.length == 0) {
				throw new Error("Information Not Found!");
			}

			const [informationUpdated] =
				await this.InformationService.updateInformation(
					settingsConfig,
					informationId,
					req.body
				);

			if (informationUpdated == 0) {
				throw new Error("Could Not Update information");
			}
			res.status(StatusCodes.OK).json("Information Updated");
			return;
		} catch (error) {
			next(error);
		}
	}

	async deleteInformation(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside deleteUser`);

			const { informationId } = req.params;
			const information = await this.InformationService.getInformationById(
				settingsConfig,
				informationId,
				req.query
			);

			if (information.length == 0) {
				throw new Error("Information Not Found!");
			}

			const informationDeleted =
				await this.InformationService.deleteInformation(
					settingsConfig,
					informationId
				);

			if (!informationDeleted) {
				throw new Error("Could Not Delete Information");
			}
			res.status(StatusCodes.OK).json("Information Deleted");
			return;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new InformationController();
