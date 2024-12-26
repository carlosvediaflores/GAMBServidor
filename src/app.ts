import express, { Express } from "express";
import * as bodyParser from "body-parser";
import UserModules from "./modules/usermodule/init";
import ConvenioModule from "./modules/conveniomodule/init";
import SlaiderModule from "./modules/webpagemodule/init";
import AlmacenesModule from "./modules/almacenesModule/init";
//import ActivosModule from "./modules/activosModule/init";
import ArchivosModule from "./modules/archivosModule/init";
import mongoose, { Mongoose } from "mongoose";
import FileUpload from "express-fileupload";
import Cors from "cors";
import DocumentosModule from "./modules/documentos/init";
import DependenciasModule from "./modules/correspondenciasModule/init";

//import WebpageModule from "./modules/webpagemodule/init";
class App {
  public app: Express = express();
  public mongooseClient: Mongoose;
  constructor() {
    this.configuration();
    this.connectDatabase();
    this.initApp();
  }
  public connectDatabase() {
    let host: string = "mongodb://172.19.0.2:27017";
    let database: string = process.env.DATABASE || "GAMB_BD";
    let connectionString: string = `${host}/${database}`;
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    //Eventos
    mongoose.connection.on("error", (err) => {
      console.log("Connection Fail");
      console.log(err);
    });
    mongoose.connection.on("open", () => {
      console.log("database connection success!");
    });
    this.mongooseClient = mongoose;
  }
  public configuration() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(FileUpload({ limits: { fileSize: 100 * 1024 * 1024 } }));
  }
  public initApp() {
    this.app.use(Cors());
    console.log("LOAD MODULES");
    const userModule = new UserModules("/api", this.app);
    const convenioModule = new ConvenioModule("/api", this.app);
    const slaiderModule = new SlaiderModule("/api", this.app);
    const almacenes = new AlmacenesModule("/api", this.app);
    //const activos = new ActivosModule("/api", this.app);
    const archivos = new ArchivosModule("/api", this.app);
    const documentos = new DocumentosModule("/api", this.app);
    const dependencias = new DependenciasModule("/api", this.app);
  }
}
export default new App();
