import * as express from "express";
import { Router } from "../interfaces";
import { CaseController } from "../controllers";

export class CaseRouter implements Router {
	public expressRouter: express.Router = express.Router();

	constructor() {
		const userController = new CaseController();
		// const userController = {};
		this.initializeRoutes(userController);
	}

	public initializeRoutes(controller: CaseController): void {
		const path = "/cases";

		this.expressRouter
			.get(path, controller.getCases)
			.get(`${path}/:date`, controller.getByDate)
			.get(`${path}daily/`, controller.getAllCaseDays)
			.post(path, controller.create)
			.delete(`${path}/:id`, controller.deleteById);
	}
}
