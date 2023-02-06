import RoutesController from "./routeController/routesController";
import { Express } from "express";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //*------------Routes Slider--------*//
    app
      .route(`${this.routeparent}/slaider`)
      .post(this.routesController.createSlaider);
    app
      .route(`${this.routeparent}/slaider`)
      .get(this.routesController.getSlaider);
    app
      .route(`${this.routeparent}/slaider/:id`)
      .get(this.routesController.getSlider);
    app
      .route(`${this.routeparent}/slaider/:id`)
      .put(this.routesController.updateSlaider);
    app
      .route(`${this.routeparent}/slaider/:id`)
      .delete(this.routesController.removeSlaider);
    app
      .route(`${this.routeparent}/uploadslider/:id?`)
      .post(this.routesController.uploadSlider);
    app
      .route(`${this.routeparent}/getimgslider/:name`)
      .get(this.routesController.getImgslider);
    //*------------Routes Blog------- getPostId-*//
    app
      .route(`${this.routeparent}/blog`)
      .post(this.routesController.createBlog);
    app.route(`${this.routeparent}/blog`).get(this.routesController.getBlog);
    app
      .route(`${this.routeparent}/blog/:slug`)
      .get(this.routesController.getPost);
    app
      .route(`${this.routeparent}/blogid/:id`)
      .get(this.routesController.getPostId);
    app
      .route(`${this.routeparent}/blog/:id`)
      .put(this.routesController.updateBlog);
    app
      .route(`${this.routeparent}/blog/:id`)
      .delete(this.routesController.removeBlog);
    app
      .route(`${this.routeparent}/uploadpost/:id?`)
      .post(this.routesController.uploadPost);
    app
      .route(`${this.routeparent}/getimgpost/:name`)
      .get(this.routesController.getImgPost);
    app.route(`${this.routeparent}/blogs`).get(this.routesController.getBlogs);
    //*------------Routes Category--------*//
    app
      .route(`${this.routeparent}/category`)
      .post(this.routesController.createCategory);
    app
      .route(`${this.routeparent}/category`)
      .get(this.routesController.getCategory);
    app
      .route(`${this.routeparent}/category/:id`)
      .get(this.routesController.getCategory);
    app
      .route(`${this.routeparent}/category/:id`)
      .put(this.routesController.updateCategory);
    app
      .route(`${this.routeparent}/category/:id`)
      .delete(this.routesController.removeCategory);
    //*------------Routes Gaceta--------*//

    app
      .route(`${this.routeparent}/gaceta/:id`)
      .get(this.routesController.getGaceta);
    app
      .route(`${this.routeparent}/gaceta/:id`)
      .delete(this.routesController.removeGaceta);
    app
      .route(`${this.routeparent}/uploadgaceta/:id?`)
      .post(this.routesController.uploadGaceta);
    app
      .route(`${this.routeparent}/getgaceta/:name`)
      .get(this.routesController.getImgGaceta);
    app
      .route(`${this.routeparent}/gacetas`)
      .get(this.routesController.getGacetas);
    app
      .route(`${this.routeparent}/gaceta/:id`)
      .put(this.routesController.updateGaceta);
    app
      .route(`${this.routeparent}/searchgaceta/:search`)
      .get(this.routesController.searchGaceta);

    //*------------Routes IMGPOT--------*//

    app
      .route(`${this.routeparent}/imgpost/:id`)
      .delete(this.routesController.removeImgpost);
    app
      .route(`${this.routeparent}/imgpost/:id`)
      .put(this.routesController.updateImgpost);

    //*------------Routes POA--------*//
    app.route(`${this.routeparent}/poa/:id`).get(this.routesController.getPoa);
    app
      .route(`${this.routeparent}/poa/:id`)
      .delete(this.routesController.removePoa);
    app
      .route(`${this.routeparent}/uploadpoa/:id?`)
      .post(this.routesController.uploadPoa);
    app
      .route(`${this.routeparent}/getpoa/:name`)
      .get(this.routesController.getArchivoPoa);
    app.route(`${this.routeparent}/poas`).get(this.routesController.getPoas);
    app
      .route(`${this.routeparent}/poa/:id`)
      .put(this.routesController.updatePoa);
    app
      .route(`${this.routeparent}/searchpoa/:search`)
      .get(this.routesController.searchPoa);
    //*------------Routes ARCHIVO POA--------*//
    app
      .route(`${this.routeparent}/archivoPoa/:id`)
      .delete(this.routesController.deleteArchivoPoa);
    app
      .route(`${this.routeparent}/archivoPoa/:id`)
      .put(this.routesController.updateArchivoPoa);

    //*------------Routes PTDI--------*//
    app
      .route(`${this.routeparent}/ptdi/:id`)
      .get(this.routesController.getPtdi);
    app
      .route(`${this.routeparent}/ptdi/:id`)
      .delete(this.routesController.removePtdi);
    app
      .route(`${this.routeparent}/uploadptdi/:id?`)
      .post(this.routesController.uploadPtdi);
    app
      .route(`${this.routeparent}/getptdi/:name`)
      .get(this.routesController.getImgPtdi);
    app.route(`${this.routeparent}/ptdis`).get(this.routesController.getPtdis);
    app
      .route(`${this.routeparent}/ptdi/:id`)
      .put(this.routesController.updatePtdi);
    app
      .route(`${this.routeparent}/searchptdi/:search`)
      .get(this.routesController.searchPtdi);
    //*------------Routes Rendiciones--------*//
    app
      .route(`${this.routeparent}/rendicion/:id`)
      .get(this.routesController.getRendicion);
    app
      .route(`${this.routeparent}/rendicion/:id`)
      .delete(this.routesController.removeRendicion);
    app
      .route(`${this.routeparent}/uploadrendicion/:id?`)
      .post(this.routesController.uploadRendicion);
    app
      .route(`${this.routeparent}/getrendicion/:name`)
      .get(this.routesController.getFileRendicion);
    app
      .route(`${this.routeparent}/rendiciones`)
      .get(this.routesController.getRendicions);
    app
      .route(`${this.routeparent}/rendicion/:id`)
      .put(this.routesController.updateRendicion);
    app
      .route(`${this.routeparent}/searchrendicion/:search`)
      .get(this.routesController.searchRendicion);
  }
}
export default Routes;
