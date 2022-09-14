import { Express } from "express";
import Routes from "./routes";
class SlaiderModule{
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init slaider module");
        this.routes = new Routes(root, app);
    }  
}
export default SlaiderModule;