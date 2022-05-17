import express, { Express } from "express";
import * as bodyParser from "body-parser";
import UserModules from "./modules/usermodule/init";
import mongoose, { Mongoose } from "mongoose";
import FileUpload from "express-fileupload";
import Cors from "cors";
class App { 
  public app: Express = express();
  public mongooseClient: Mongoose;
  constructor() {
    this.configuration();
    this.connectDatabase();
    this.initApp();
  }
  public connectDatabase() {
    let host: string = "mongodb://172.18.0.2:27017";
    let database: string = process.env.DATABASE || "GAMB_BD";
    let connectionString: string = `${host}/${database}`;
    
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
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
    this.app.use(FileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
  }
  public initApp() {
 
    this.app.use(Cors());
    console.log("LOAD MODULES");
    const userModule = new UserModules("/api", this.app);
    
  }
  
}
export default new App();
