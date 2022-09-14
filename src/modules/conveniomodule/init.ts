import { Express } from "express";
import Routes from "./routes";
class ConvenioModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init convenio module");
        this.routes = new Routes(root, app);
    }   
}
export default ConvenioModule;