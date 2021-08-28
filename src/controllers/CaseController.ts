import { NextFunction } from "connect";
import * as express from "express";
import { ICase } from "src/interfaces/case";
import { generateDate } from "../utils/functions";
import { ObjectNotFoundException } from "../exceptions";
import { HttpException } from "../exceptions";
import { Controller } from "../interfaces";
import { CaseTotalModel, CaseModel } from "../models";

export class CaseController implements Controller {
	private caseTotal = CaseTotalModel;
	private case = CaseModel;

	public getCases = async (
		request: express.Request,
		response: express.Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const cases = await this.caseTotal.find({});
			if (!cases)
				response
					.send(200)
					.json({ isEmpty: true, message: "NO RECORD YET" });
			response.status(200).json(cases[0]);
		} catch (error) {
			next(new HttpException(500, error.message));
		}
	};

	public getByDate = async (
		req: express.Request,
		res: express.Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const date = req.params.date;

			const cases = await this.case.find({ date });

			let totalDayInfected = 0;
			let totalDayHealed = 0;
			for (let i = 0; i < cases.length; i++) {
				totalDayInfected += cases[0].infectedQuantity;
				totalDayHealed += cases[0].healedQuantity;
			}

			res.status(200);
			res.send({ infected: totalDayHealed, healed: totalDayInfected });
		} catch (error) {
			next(new HttpException(500, error.message));
		}
	};

	public getAllCaseDays = async (
		req: express.Request,
		res: express.Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const cases = await this.case.find({});

			res.status(200);
			res.send(cases);
		} catch (error) {
			next(new HttpException(500, error.message));
		}
	};

	public create = async (
		request: express.Request,
		response: express.Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const caseData: ICase = request.body;

			const newCase = new this.case({
				...caseData,
				date: generateDate()
			});

			await newCase.save();

			const caseTotal = await this.caseTotal.find({});

			if (caseTotal.length) {
				const {
					id,
					totalInfected: currentTI,
					totalHealed: currentTH
				} = caseTotal[0];

				const updatedValue = {
					totalInfected: currentTI + caseData.infectedQuantity,
					totalHealed: currentTH + caseData.healedQuantity
				};
				await this.caseTotal.findByIdAndUpdate(id, updatedValue);
			} else {
				const newCaseTotal = new this.caseTotal({
					totalInfected: caseData.infectedQuantity,
					totalHealed: caseData.healedQuantity
				});

				await newCaseTotal.save();
			}
			response.status(200).json({
				message: "SUCCESS",
				success: true
			});
		} catch (error) {
			next(new HttpException(500, error.message));
		}
	};

	public deleteById = async (
		request: express.Request,
		response: express.Response,
		next: NextFunction
	): Promise<void> => {
		const id = request.params.id;
		const deletedCase = await this.case.findById(id);

		if (!deletedCase) {
			response
				.status(404)
				.json({ success: false, message: "CASE NOT FOUND" });
			return;
		}
		const caseTotal = await this.caseTotal.find({});
		if (caseTotal) {
			const {
				id: caseTotalId,
				totalInfected: currentTI,
				totalHealed: currentTH
			} = caseTotal[0];

			const updatedValue = {
				totalInfected: currentTI - deletedCase?.infectedQuantity,
				totalHealed: currentTH - deletedCase?.healedQuantity
			};

			await this.caseTotal.findByIdAndUpdate(caseTotalId, updatedValue);
		}
		const success = await this.case.findByIdAndDelete(id);
		if (success) {
			response.status(200);
			response.json({
				message: `the case with id: ${id} was deleted successfully`
			});
		} else next(new ObjectNotFoundException(this.case.modelName, id));
	};
}
