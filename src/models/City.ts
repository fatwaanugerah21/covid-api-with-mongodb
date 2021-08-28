import { createSchema, Type, typedModel } from "ts-mongoose";

const CitySchema = createSchema({
	name: Type.string()
});

export const CityModel = typedModel("City", CitySchema);
