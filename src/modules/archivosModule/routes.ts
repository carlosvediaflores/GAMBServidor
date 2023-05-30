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
 .route(`${this.routeparent}/carpeta/:id`)
 .get(this.routesController.getCarpeta);
app
 .route(`${this.routeparent}/carpeta/:id`)
 .delete(this.routesController.removeCarpeta);
app
 .route(`${this.routeparent}/uploadCarpeta/:id?`)
 .post(this.routesController.uploadCarpeta);
app
 .route(`${this.routeparent}/getCarpeta/:name`)
 .get(this.routesController.getFileCarpeta);
app
 .route(`${this.routeparent}/carpetas`)
 .get(this.routesController.getCarpetas);
app
 .route(`${this.routeparent}/carpeta/:id`)
 .put(this.routesController.updateCarpeta);
app
 .route(`${this.routeparent}/searchCarpeta/:search`)
 .get(this.routesController.searchCarpeta);

  }
}
export default Routes;