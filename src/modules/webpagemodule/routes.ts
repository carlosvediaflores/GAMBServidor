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
        app
            .route(`${this.routeparent}/getslider/:search`)
            .get(this.routesController.getSliders);
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
        app
            .route(`${this.routeparent}/blog`)
            .post(this.routesController.createBlog);
        app
            .route(`${this.routeparent}/blog`)
            .get(this.routesController.getBlog);
        app
            .route(`${this.routeparent}/blog/:id`)
            .get(this.routesController.getSlaider);
        app
            .route(`${this.routeparent}/blog/:id`)
            .put(this.routesController.updateBlog);
        app
            .route(`${this.routeparent}/blog/:id`)
            .delete(this.routesController.removeBlog);
    }
}
export default Routes;