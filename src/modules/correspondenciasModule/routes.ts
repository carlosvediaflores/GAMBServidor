import { Express } from "express";
import RoutesController from "./routesController/RoutesController";
import jsonwebtokenSecurity from "../usermodule/middleware";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //*------------Routes CORRESPONENCIAS--------*//
    app
      .route(`${this.routeparent}/correspondencia`)
      .post(this.routesController.createCorrespondencia);
    app
      .route(`${this.routeparent}/correspondencia/:id`)
      .get(this.routesController.getCorrespondencia);
    app
      .route(`${this.routeparent}/correspondencia/:id`)
      .delete(this.routesController.removeCorrespondencia);
    app
      .route(`${this.routeparent}/uploadCorrespondencia/:id?`)
      .put(this.routesController.uploadCorrespondencia);
    app
      .route(`${this.routeparent}/correspondencias`)
      .get(this.routesController.getCorrespondencias);
    app
      .route(`${this.routeparent}/buscarUltimo`)
      .get(this.routesController.buscarUltimo);
      app
      .route(`${this.routeparent}/plantilla/:fileName`)
      .get(this.routesController.getNota);
      app
      .route(`${this.routeparent}/downloadFile/:fileName`)
      .get(this.routesController.downloadFile);
    app
      .route(`${this.routeparent}/correspondencia/:id`)
      .put(this.routesController.updateCorrespondencia);
    /*  app
        .route(`${this.routeparent}/searchCorrespondencia/:search`)
        .get(this.routesController.searhCorrespondencia); */
    /* app
      .route(`${this.routeparent}/addAreaArch/:id`)
      .put(this.routesController.addArea); */
    app
      .route(`${this.routeparent}/addUserDependencia/:id`)
      .put(this.routesController.addFuncionario);
    app
   /*    .route(`${this.routeparent}/removeArchivo/:id`)
      .put(this.routesController.removeArchivo); */

    //-------AREA DEPENDENCIA--//
    app
      .route(`${this.routeparent}/dependencia`)
      .post(this.routesController.createDependencia);
    app
      .route(`${this.routeparent}/dependencias`)
      .get(this.routesController.getDependencias);
    app
      .route(`${this.routeparent}/dependencia/:id`)
      .get(this.routesController.getDependencia);
    app
      .route(`${this.routeparent}/dependencia/:id`)
      .patch(this.routesController.updateDependencia);
    app
      .route(`${this.routeparent}/dependencia/:id`)
      .delete(this.routesController.removeDependencia);
    /*  app
      .route(`${this.routeparent}/getArchivos/:name`)
      .get(this.routesController.getFileArchivo); */
    app
      .route(`${this.routeparent}/getArchivosSin`)
      .get(this.routesController.getContaSin);

    //-------SUBTIPO--//
    app
      .route(`${this.routeparent}/subTipo`)
      .post(this.routesController.createSubTipo);
    app
      .route(`${this.routeparent}/subTipos`)
      .get(this.routesController.getSubTipos);
    app
      .route(`${this.routeparent}/subTipo/:id`)
      .get(this.routesController.getSubTipos);
    app
      .route(`${this.routeparent}/subTipo/:id`)
      .patch(this.routesController.updateSubTipo);
    // app
    //   .route(`${this.routeparent}/addTipo/:id`)
    //   .put(this.routesController.addTipo);
    app
      .route(`${this.routeparent}/removeSubTipo/:id`)
      .put(this.routesController.removeTipo);
    app
      .route(`${this.routeparent}/SubTipo/:id`)
      .delete(this.routesController.removeSubTipo);

    //-------TIPO--//
    app
      .route(`${this.routeparent}/tipo`)
      .post(this.routesController.createTipo);
    app
      .route(`${this.routeparent}/tipos`)
      .get(this.routesController.getTipos);
    app
      .route(`${this.routeparent}/tipo/:id`)
      .get(this.routesController.getTipo);
    app
      .route(`${this.routeparent}/tipo/:id`)
      .patch(this.routesController.updateTipo);
    app
      .route(`${this.routeparent}/addSubTipo/:id`)
      .patch(this.routesController.addSubTipo);
    app
      .route(`${this.routeparent}/removeTipo/:id`)
      .put(this.routesController.removeTipo);
    app
      .route(`${this.routeparent}/tipo/:id`)
      .delete(this.routesController.removeTipo);
      app
      .route(`${this.routeparent}/downloadPlantilla/:nombreTipo`)
      .get(this.routesController.downloadPlantilla);
  }
}
export default Routes;
