import { Express } from "express";
import Routes from "./routes";
class DocumentosModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init Documentos module");
        this.routes = new Routes(root, app);
    }   
}
export default DocumentosModule;