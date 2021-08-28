import { createSchema, Type, typedModel } from "ts-mongoose";

const CaseSchema = createSchema({
	infectedQuantity: Type.number(),
	healedQuantity: Type.number(),
	date: Type.string()
});

export const CaseModel = typedModel("Case", CaseSchema);
