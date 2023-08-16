import { Express } from "express";
import RoutesController from "./routesController/RoutesController";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //*------------Routes carpetas--------*//
    app
      .route(`${this.routeparent}/carpeta`)
      .post(this.routesController.createCarpeta);
    app
      .route(`${this.routeparent}/carpeta/:id`)
      .get(this.routesController.getCarpeta);
    app
      .route(`${this.routeparent}/carpeta/:id`)
      .delete(this.routesController.removeCarpeta);
    app
      .route(`${this.routeparent}/uploadCarpeta/:id?`)
      .post(this.routesController.uploadCarpeta);
    app
      .route(`${this.routeparent}/carpetas`)
      .get(this.routesController.getCarpetas);
    app
      .route(`${this.routeparent}/carpeta/:id`)
      .put(this.routesController.updateCarpeta);
    app
      .route(`${this.routeparent}/searchCarpeta/:search`)
      .get(this.routesController.searchCarpeta);
    app
      .route(`${this.routeparent}/addAreaArch/:id`)
      .put(this.routesController.addArea);
    app
      .route(`${this.routeparent}/addArchivo/:id`)
      .put(this.routesController.addArchivo);
    app
      .route(`${this.routeparent}/removeArchivo/:id`)
      .put(this.routesController.removeArchivo);
      app
      .route(`${this.routeparent}/searchContaAll`)
      .get(this.routesController.queryContaAll);
    //-------AREA CONTABILIDAD--//
    app
      .route(`${this.routeparent}/Contabilidad`)
      .post(this.routesController.createConta);
    app
      .route(`${this.routeparent}/contabilidades`)
      .get(this.routesController.getContas);
    app
      .route(`${this.routeparent}/getArchivos/:name`)
      .get(this.routesController.getFileArchivo);
    app
      .route(`${this.routeparent}/getArchivosSin`)
      .get(this.routesController.getContaSin);
    app
      .route(`${this.routeparent}/contabilidad/:id`)
      .get(this.routesController.getConta);
    app
      .route(`${this.routeparent}/contabilidad/:id`)
      .put(this.routesController.updateConta);
    app
      .route(`${this.routeparent}/contabilidad/:id`)
      .delete(this.routesController.removeConta);
    app
      .route(`${this.routeparent}/searchConta/:search`)
      .get(this.routesController.searchConta);

    //-------AREA--//
    app
      .route(`${this.routeparent}/area`)
      .post(this.routesController.createArea);
    app.route(`${this.routeparent}/areas`).get(this.routesController.getAreas);
    app
      .route(`${this.routeparent}/area/:id`)
      .get(this.routesController.getAreas);
    app
      .route(`${this.routeparent}/area/:id`)
      .put(this.routesController.updateArea);
    app
      .route(`${this.routeparent}/addTipo/:id`)
      .put(this.routesController.addTipo);
    app
      .route(`${this.routeparent}/removeTipo/:id`)
      .put(this.routesController.removeTipo);
    app
      .route(`${this.routeparent}/area/:id`)
      .delete(this.routesController.removeArea);
    app
      .route(`${this.routeparent}/searchArea/:search`)
      .get(this.routesController.searchArea);
  }
}
export default Routes;
