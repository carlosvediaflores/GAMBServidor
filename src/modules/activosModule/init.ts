import { Express } from "express";
import Routes from "./routes";
class ActivosModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init activos module");
        this.routes = new Routes(root, app);
    }   
}
export default ActivosModule;