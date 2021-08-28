import { createSchema, Type, typedModel } from "ts-mongoose";

const CaseTotalSchema = createSchema({
	totalInfected: Type.number(),
	totalHealed: Type.number()
});

export const CaseTotalModel = typedModel("CaseInfo", CaseTotalSchema);
