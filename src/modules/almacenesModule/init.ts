import { Express } from "express";
import Routes from "./routes";
class AlmacenesModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init almacenes module");
        this.routes = new Routes(root, app);
    }   
}
export default AlmacenesModule;