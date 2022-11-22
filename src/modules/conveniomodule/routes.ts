import { Express } from "express";

import RoutesController from "./routeController/RoutesController";
class Routes {
    private routesController: RoutesController;
    private routeparent: string;
    constructor(routeparent: string, app: Express) {
        this.routesController = new RoutesController();
        this.routeparent = routeparent;
        this.configureRoutes(app);
    }
    private configureRoutes(app: Express) {
        //*------------Routes Entidad--------*//
        app
            .route(`${this.routeparent}/entidad`)
            .post(this.routesController.createEntidad);
        app
            .route(`${this.routeparent}/entidad`)
            .get(this.routesController.getEntidad);
        app
            .route(`${this.routeparent}/entidad/:id`)
            .get(this.routesController.getEnti);
        app
            .route(`${this.routeparent}/entidad/:id`)
            .put(this.routesController.updateEntidad);
        app
            .route(`${this.routeparent}/entidad/:id`)
            .delete(this.routesController.removeEntidad);
        //*------------Routes Representantes--------*//
        app
            .route(`${this.routeparent}/repres`)
            .post(this.routesController.createRepres);
        app
            .route(`${this.routeparent}/repres`)
            .get(this.routesController.getRepres);
        app
            .route(`${this.routeparent}/repres/:id`)
            .get(this.routesController.getReprese);
        app
            .route(`${this.routeparent}/repres/:id`)
            .put(this.routesController.updateRepres);
        app
            .route(`${this.routeparent}/repres/:id`)
            .delete(this.routesController.removeRepres);
        //*------------Routes Convenio--------*//
        app
            .route(`${this.routeparent}/convenio`)
            .post(this.routesController.createConvenio);
        app
            .route(`${this.routeparent}/convenio`)
            .get(this.routesController.getConvenio);
        app
            .route(`${this.routeparent}/convenios`)
            .get(this.routesController.getConvenios);
        app
            .route(`${this.routeparent}/convenio/:id`)
            .get(this.routesController.getConveni);
        app
            .route(`${this.routeparent}/searchconvenio/:search`)
            .get(this.routesController.searchCV);
        app
            .route(`${this.routeparent}/convenio/:id`)
            .put(this.routesController.updateConvenio);
        app
            .route(`${this.routeparent}/editarestado/:id`)
            .put(this.routesController.editarEstado);
        app
            .route(`${this.routeparent}/convenio/:id`)
            .delete(this.routesController.removeConvenio);
        app
            .route(`${this.routeparent}/addentidad/:id`)
            .put(this.routesController.addEntidad);
        app
            .route(`${this.routeparent}/uploadconvenio/:id`)
            .post(this.routesController.uploadConvenio);
        app
            .route(`${this.routeparent}/getfileconvenio/:name`)
            .get(this.routesController.getFileConv);
        app
            .route(`${this.routeparent}/addtransferencia/:id`)
            .post(this.routesController.addTransf);
        app
            .route(`${this.routeparent}/getcomprobante/:name`)
            .get(this.routesController.getTransf);
        //*------------Routes Desembolso--------*//
        app
            .route(`${this.routeparent}/desem`)
            .post(this.routesController.createDesem);
        app
            .route(`${this.routeparent}/desem`)
            .get(this.routesController.getDesem);
        app
            .route(`${this.routeparent}/desem/:id`)
            .put(this.routesController.updateDesem);
        app
            .route(`${this.routeparent}/desem/:id`)
            .delete(this.routesController.removeDesem);
        //*------------Routes Estado Monto--------*//
        app
            .route(`${this.routeparent}/estmonto`)
            .post(this.routesController.createEstmonto);
        app
            .route(`${this.routeparent}/estmonto`)
            .get(this.routesController.getEstmonto);
        app
            .route(`${this.routeparent}/estmonto/:id`)
            .put(this.routesController.updateEstmonto);
        app
            .route(`${this.routeparent}/estmonto/:id`)
            .delete(this.routesController.removeEstmonto);
            //-------files----//
        app
            .route(`${this.routeparent}/filescv`)
            .get(this.routesController.getFilescv);
    }
}
export default Routes;