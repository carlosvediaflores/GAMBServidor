import { Express } from "express";
import Routes from "./routes";
class ArchivosModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init archivos module");
        this.routes = new Routes(root, app);
    }   
}
export default ArchivosModule;