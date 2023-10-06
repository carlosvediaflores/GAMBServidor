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

    //-------MODELO--//
    app
      .route(`${this.routeparent}/modelo`)
      .post(this.routesController.createModelo);
    app
      .route(`${this.routeparent}/modelos`)
      .get(this.routesController.getModelos);
    app
      .route(`${this.routeparent}/modelo/:id`)
      .get(this.routesController.getModelo);
    app
      .route(`${this.routeparent}/modelo/:id`)
      .put(this.routesController.updateModelo);
    app
      .route(`${this.routeparent}/modelo/:id`)
      .delete(this.routesController.removeModelo);
    //Crear, Editar Documento
    app
      .route(`${this.routeparent}/uploadDocument/:id?`)
      .post(this.routesController.uploadDocument);
      // Buscar, Filtrar
    app
      .route(`${this.routeparent}/documentos`)
      .get(this.routesController.getDocuments);
      //Buscar por Id
    app
      .route(`${this.routeparent}/documento/:id`)
      .get(this.routesController.getDocument);
      ////Ver Arhivo
    app
      .route(`${this.routeparent}/getDocument/:name`)
      .get(this.routesController.getFileDocument);
      //Eliminar Document
      app
      .route(`${this.routeparent}/document/:id`)
      .delete(this.routesController.removeDocument);
  }
}
export default Routes;
