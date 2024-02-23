import RoutesController from "./routeController/RoutesController";
import jsonwebtokenSecurity from "./middleware";
import { Express } from "express";
//import Cors from "cors";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //**--USER ROUTES--------------------------------------------------------------------------------------- */
    app.route(`${this.routeparent}/login`).post(this.routesController.login);
    app
      .route(`${this.routeparent}/users`)
      .post(jsonwebtokenSecurity, this.routesController.createUsers);
    app
      .route(`${this.routeparent}/users/:limit?/:page?`)
      .get(jsonwebtokenSecurity, this.routesController.getUsers);
    app
      .route(`${this.routeparent}/listUsers`)
      .get(this.routesController.lisUsers);
    app
      .route(`${this.routeparent}/user/:id`)
      .get(this.routesController.getUser);
    app
      .route(`${this.routeparent}/userPost/:post`)
      .get(this.routesController.getUs);
    app
      .route(`${this.routeparent}/user/:id`)
      .put(jsonwebtokenSecurity, this.routesController.updateUser);
    app
      .route(`${this.routeparent}/users/:id`)
      .delete(jsonwebtokenSecurity, this.routesController.removeUsers);
    app
      .route(`${this.routeparent}/uploadportrait/:id`)
      .post(this.routesController.uploadPortrait);
    app
      .route(`${this.routeparent}/getportrait/:id`)
      .get(this.routesController.getPortrait);

    /*app
      .route(`${this.routeparent}/addrol/:id`)
      .put(this.routesController.addRol);
    app
      .route(`${this.routeparent}/removerol/:id`)
      .put(this.routesController.removeUserRol);
      */

    //**--ROLES ROUTES--------------------------------------------------------------------------------------- */
    app
      .route(`${this.routeparent}/roles`)
      .post(this.routesController.createRol);
    app
      .route(`${this.routeparent}/roles/:id`)
      .delete(this.routesController.removeRol);
    app.route(`${this.routeparent}/roles/`).get(this.routesController.getRoles);

    ////////-------------ORGANIZACION ROUTES-------------------------
    app.route(`${this.routeparent}/org`).post(this.routesController.createOrg);
    app.route(`${this.routeparent}/org`).get(this.routesController.getOrg);
    app
      .route(`${this.routeparent}/org/:id`)
      .put(this.routesController.updateOr);
    app
      .route(`${this.routeparent}/org/:id`)
      .delete(this.routesController.removeOrg);
    app
      .route(`${this.routeparent}/org/:nombredir`)
      .get(this.routesController.getOr);
    app
      .route(`${this.routeparent}/orgs/:id`)
      .get(this.routesController.getOrId);

    ///////////-----------SUB DIRECCION ROUTES--------------

    app
      .route(`${this.routeparent}/subdir`)
      .post(this.routesController.createSubdir);
    app
      .route(`${this.routeparent}/addsubdir/:id`)
      .put(this.routesController.addSubdir);
    app
      .route(`${this.routeparent}/removsubdir/:id`)
      .put(this.routesController.removSubdir);
    app
      .route(`${this.routeparent}/subdir`)
      .get(this.routesController.getSubdir);
    app
      .route(`${this.routeparent}/subdir/:nombredir`)
      .get(this.routesController.getSubUni);
    app
      .route(`${this.routeparent}/subUnidad/:id`)
      .get(this.routesController.getSubUnidad);
    //app
    //.route(`${this.routeparent}/subdir/:id`)
    //.put(this.routesController.updateSubdir);
    app
      .route(`${this.routeparent}/subdir/:id`)
      .delete(this.routesController.removeSubdir);

    /////HOJA DE RUTA--------------------
    app
      .route(`${this.routeparent}/hoja`)
      .post(this.routesController.createHojas);
    app
      .route(`${this.routeparent}/hojas/:limit?/:page?`)
      .get(this.routesController.getHojas);
    app
      .route(`${this.routeparent}/hojaRuta`)
      .get(jsonwebtokenSecurity, this.routesController.getHojaRutas);
    app
      .route(`${this.routeparent}/hoja/:id`)
      .get(this.routesController.getHoja);
    app
      .route(`${this.routeparent}/hoja/:id`)
      .put(this.routesController.updateHoja);
    app
      .route(`${this.routeparent}/hoja/:id`)
      .delete(this.routesController.removeHoja);
    app
      .route(`${this.routeparent}/hojasearch/:search`)
      .get(this.routesController.searchHoja);
    app
      .route(`${this.routeparent}/searchPublicHR/:term`)
      .get(this.routesController.searchPublicHR);
    app
      .route(`${this.routeparent}/uploadhojaruta/:id`)
      .post(this.routesController.uploadHoja);
    app
      .route(`${this.routeparent}/gethojaruta/:name`)
      .get(this.routesController.getHojaRuta);
    app
      .route(`${this.routeparent}/asociar/:nuit`)
      .put(this.routesController.asociarHoja);
      app
      .route(`${this.routeparent}/asociarHR/:nuit`)
      .put(this.routesController.asociarHR);
    app
      .route(`${this.routeparent}/asociar/:nuit`)
      .get(this.routesController.asociarHojas);
    app
      .route(`${this.routeparent}/totales`)
      .get(this.routesController.contHRuta);

    ///////////-----------SEGUIMIENTO ROUTES--------------

    app
      .route(`${this.routeparent}/segui`)
      .post(this.routesController.createSegui);
    app
      .route(`${this.routeparent}/segui/:id`)
      .put(this.routesController.addSegui);
    app
      .route(`${this.routeparent}/segui/:id`)
      .get(this.routesController.getSegui);
    app
      .route(`${this.routeparent}/seguiTotales`)
      .get(this.routesController.contOficina);
    app
      .route(`${this.routeparent}/oficina`)
      .get(jsonwebtokenSecurity, this.routesController.getOficina);
    app.route(`${this.routeparent}/segui`).get(this.routesController.getSeguis);
    app
      .route(`${this.routeparent}/seguis/:id`)
      .put(this.routesController.updateSegui);
    app
      .route(`${this.routeparent}/seguiaso/:nuit`)
      .put(this.routesController.updateSeguiAs);
    app
      .route(`${this.routeparent}/seguiOfi/:id`)
      .put(this.routesController.updateSeguiOfi);
    app
      .route(`${this.routeparent}/eliminarEnvio/:id`)
      .get(this.routesController.eliminarEnvio);
    app
      .route(`${this.routeparent}/segui/:id`)
      .delete(this.routesController.removeSegui);
    app
      .route(`${this.routeparent}/seguias/:nuit`)
      .get(this.routesController.getSeguiAs);

    //file------//
    app
      .route(`${this.routeparent}/file`)
      .post(this.routesController.createFile);
    app.route(`${this.routeparent}/org`).get(this.routesController.getOrg);

    app
      .route(`${this.routeparent}/org/:id`)
      .put(this.routesController.updateOr);
    app
      .route(`${this.routeparent}/org/:id`)
      .delete(this.routesController.removeOrg);
    app
      .route(`${this.routeparent}/org/:nombredir`)
      .get(this.routesController.getOr);
    app
      .route(`${this.routeparent}/orgs/:id`)
      .get(this.routesController.getOrId);

    //-----Archivos---//
    app.route(`${this.routeparent}/arch`).get(this.routesController.getArc);
    app
      .route(`${this.routeparent}/arch`)
      .post(this.routesController.createArch);
    app
      .route(`${this.routeparent}/addarch/:id`)
      .put(this.routesController.addArch);
    app
      .route(`${this.routeparent}/arch/:id`)
      .put(this.routesController.updateArch);
    app
      .route(`${this.routeparent}/arch/:id`)
      .delete(this.routesController.removeArch);
  }
}
export default Routes;
