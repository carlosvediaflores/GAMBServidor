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

    ///////////TipoNormativas////////////////
    //Crear
    app
      .route(`${this.routeparent}/tipoNormativa`)
      .post(this.routesController.createTipoNormativa);
    // Listar
    app
      .route(`${this.routeparent}/tipoNormativas`)
      .get(this.routesController.getTipoNormativas);
    //Buscar por Id
    app
      .route(`${this.routeparent}/tipoNormativa/:id`)
      .get(this.routesController.getTipoNormativa);
    ////Editar TipoNormativa
    app
      .route(`${this.routeparent}/tipoNormativa/:id`)
      .put(this.routesController.updateTipoNormativa);
    //Eliminar TipoNormativa
    app
      .route(`${this.routeparent}/tipoNormativa/:id`)
      .delete(this.routesController.removeTipoNormativa);

    ///////////NORMATIVAS//////////
    //Crear, Editar Normativa
    app
      .route(`${this.routeparent}/uploadNormativa/:id?`)
      .post(this.routesController.uploadNormativa);
    // Buscar, Filtrar
    app
      .route(`${this.routeparent}/normativas`)
      .get(this.routesController.getNormativas);
    //Buscar por Id
    app
      .route(`${this.routeparent}/normativa/:id`)
      .get(this.routesController.getNormativa);
    ////Ver Arhivo de Normativa
    app
      .route(`${this.routeparent}/getNormativa/:name`)
      .get(this.routesController.getFileNormativa);
    //Eliminar Normativa
    app
      .route(`${this.routeparent}/normativa/:id`)
      .delete(this.routesController.removeNormativa);

    ///////////PRESTAMOS//////////
    //Crear,Prestamo
    app
      .route(`${this.routeparent}/prestamo`)
      .post(this.routesController.createPrestamo);
    // Buscar, Filtrar
    app
      .route(`${this.routeparent}/prestamos`)
      .get(this.routesController.getPrestamos);
    //Buscar por Id
    app
      .route(`${this.routeparent}/prestamo/:id`)
      .get(this.routesController.getPrestamo);
    ////Editar Prestamo
    app
      .route(`${this.routeparent}/prestamo/:id`)
      .put(this.routesController.updatePrestamo);
    //Eliminar Prestamo
    app
      .route(`${this.routeparent}/prestamo/:id`)
      .delete(this.routesController.removePrestamo);
    ////agregar archivo a Prestamo
    app
      .route(`${this.routeparent}/addFilePrestamo/:id`)
      .put(this.routesController.addArchivo);
    ////Ver Arhivo de prestamo
    app
      .route(`${this.routeparent}/getFilePrestamo/:name`)
      .get(this.routesController.getFilePrestamo);
    //Eliminar filePrestamo
    app
      .route(`${this.routeparent}/filePrestamo/:id`)
      .delete(this.routesController.removeFilePrestamo);
    ///////Amortizacion///////
    // Buscar
    app
      .route(`${this.routeparent}/amortizacions`)
      .get(this.routesController.getAmortizacions);
    //Crear,Amortizacion
    app
      .route(`${this.routeparent}/uploadAmortizacion/:id`)
      .put(this.routesController.uploadAmortizacion);
    //Eliminar filePrestamo
    app
      .route(`${this.routeparent}/amortizacion/:id`)
      .delete(this.routesController.removeAmortizacion);
    ////Ver Arhivo de prestamo
    app
      .route(`${this.routeparent}/getFileAmortizacion/:name`)
      .get(this.routesController.getFileAmortizacion);
    ///////////EJECUCION//////////
    //Crear,Ejecucion
    app
      .route(`${this.routeparent}/ejecucion`)
      .post(this.routesController.createEjecucion);
    // Buscar, Filtrar
    app
      .route(`${this.routeparent}/ejecucions`)
      .get(this.routesController.getEjecucions);
    //Buscar por Id
    app
      .route(`${this.routeparent}/ejecucion/:id`)
      .get(this.routesController.getEjecucion);
    ////Editar Ejecucion
    app
      .route(`${this.routeparent}/ejecucion/:id`)
      .put(this.routesController.updateEjecucion);
    //Eliminar Ejecucion
    app
      .route(`${this.routeparent}/ejecucion/:id`)
      .delete(this.routesController.removeEjecucion);
    ////agregar archivo a Ejecucion
    app
      .route(`${this.routeparent}/addEjecucionFile/:id`)
      .put(this.routesController.addArchivoEjecucion);
    ////Ver Arhivo de Ejecucion
    app
      .route(`${this.routeparent}/getEjecucionFile/:name`)
      .get(this.routesController.getFileEjecucion);
    //Eliminar fileEjecucion
    app
      .route(`${this.routeparent}/ejecucionFile/:id`)
      .delete(this.routesController.removeFileEjecucion);
  }
}
export default Routes;
