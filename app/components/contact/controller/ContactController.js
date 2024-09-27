const { StatusCodes } = require("http-status-codes");
const ContactService = require("../service/ContactService");

class contactController {
	constructor() {
		this.ContactService = new ContactService();
	}

	async createcontact(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside createContact`);

			const newContact = await this.ContactService.createcontact(
				settingsConfig,
				req.body
			);

			res.status(StatusCodes.CREATED).json(newContact);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getAllContact(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getAllContact`);
			const queryParams = req.query;

			const { count, rows } = await this.ContactService.getAllContact(
				settingsConfig,
				queryParams
			);

			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);
		} catch (error) {
			next(error);
		}
	}

	async updateContact(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside updateContact`);

			const { contactId } = req.params;
			const contact = await this.ContactService.getContactById(
				settingsConfig,
				contactId,
				req.query
			);

			if (contact.length == 0) {
				throw new Error("Contact Not Found!");
			}

			const [contactUpdated] = await this.ContactService.updateContact(
				settingsConfig,
				contactId,
				req.body
			);

			if (contactUpdated == 0) {
				throw new Error("Could Not Update Contact");
			}
			res.status(StatusCodes.OK).json("Contact Updated");
			return;
		} catch (error) {
			next(error);
		}
	}

	async deleteContact(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside deleteUser`);

			const { contactId } = req.params;
			const contact = await this.ContactService.getContactById(
				settingsConfig,
				contactId,
				req.query
			);

			if (contact.length == 0) {
				throw new Error("Contact Not Found!");
			}

			const contactDeleted = await this.ContactService.deleteContact(
				settingsConfig,
				contactId
			);

			if (!contactDeleted) {
				throw new Error("Could Not Delete Contact");
			}
			res.status(StatusCodes.OK).json("Contact Deleted");
			return;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new contactController();
