import { Express } from "express";
import Routes from "./routes";
class DependenciasModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init correspondencia module");
        this.routes = new Routes(root, app);
    }   
}
export default DependenciasModule;