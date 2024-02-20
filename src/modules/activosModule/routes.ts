import { Express } from "express";
import RoutesController from "./routesController/RoutesController";
import jsonwebtokenSecurity from "../usermodule/middleware"
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
   
    //-------AUTORIZATION--//
    app
      .route(`${this.routeparent}/autorizacion`)
      .post(this.routesController.createAutorizacion);
    app
      .route(`${this.routeparent}/autorizaciones`)
      .get(this.routesController.getAutorizaciones);
    app
      .route(`${this.routeparent}/autorizacion/:id`)
      .get(this.routesController.getAutorizacion);
    app
      .route(`${this.routeparent}/autorizacionCod/:codigo`)
      .get(this.routesController.getAutorizacionCod);
    app
      .route(`${this.routeparent}/autorizacion/:id`)
      .put(this.routesController.updateAutorizacion);
    app
      .route(`${this.routeparent}/autorizacion/:id`)
      .delete(this.routesController.removeAutorizacion);
    app
      .route(`${this.routeparent}/searchautorizacion/:search`)
      .get(this.routesController.searchAutorizacion);
    //-------VEHICULOS--//
    app
      .route(`${this.routeparent}/vehiculo`)
      .post(this.routesController.createVehiculo);
    app
      .route(`${this.routeparent}/vehiculos`)
      .get(this.routesController.getVehiculos);
    app
      .route(`${this.routeparent}/vehiculo/:id`)
      .get(this.routesController.getVehiculo);
    app
      .route(`${this.routeparent}/vehiculo/:id`)
      .put(this.routesController.updateVehiculo);
    app
      .route(`${this.routeparent}/vehiculo/:id`)
      .delete(this.routesController.removeVehiculo);
    app
      .route(`${this.routeparent}/searchVehiculo/:search?`)
      .get(this.routesController.searchVehiculo);
 
  }
}
export default Routes;
