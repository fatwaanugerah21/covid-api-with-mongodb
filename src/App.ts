import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { Router } from "./interfaces";
import { connectToDatabase } from "./utils";

class RestApi {
	public expressApp: express.Application = express();

	constructor(routers: Router[]) {
		connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRouter(routers);
	}

	public listen(): void {
		this.expressApp.listen(process.env.PORT);
	}

	private initializeRouter(routers: Router[]): void {
		this.expressApp.get("/", (req, res) =>
			res.send("Server up and running")
		);

		routers.forEach(router => {
			this.expressApp.use("/", router.expressRouter);
		});
	}

	private initializeMiddlewares(): void {
		this.expressApp.use(bodyParser.json());
		this.expressApp.use(cookieParser());
	}
}

export default RestApi;
