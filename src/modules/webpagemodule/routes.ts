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
      .get(this.routesController.getSlider);
    /*app
            .route(`${this.routeparent}/getslider/:search`)
            .get(this.routesController.getSliders);*/
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
    //*------------Routes Blog--------*//
    app
      .route(`${this.routeparent}/blog`)
      .post(this.routesController.createBlog);
    app.route(`${this.routeparent}/blog`).get(this.routesController.getBlog);
    app
      .route(`${this.routeparent}/blog/:id`)
      .get(this.routesController.getPost);
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
  }
}
export default Routes;
