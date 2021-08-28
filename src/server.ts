import App from "./App";
import { CaseRouter } from "./routes/CaseRouter";
import { validateEnv } from "./utils";

validateEnv();

const server = new App([new CaseRouter()]);

console.log(`server run on : http://localhost:${process.env.PORT}`);

server.listen();
