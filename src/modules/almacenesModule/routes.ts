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
    //-------CATEGORIAS--//
    app
      .route(`${this.routeparent}/categoria`)
      .post(this.routesController.createCategoria);
    app
      .route(`${this.routeparent}/categoria`)
      .get(this.routesController.getCategorias);
    app
      .route(`${this.routeparent}/categoria/:id`)
      .get(this.routesController.getCategoria);
    app
      .route(`${this.routeparent}/categoriaCod/:codigo`)
      .get(this.routesController.getCategoriaCod);
    app
      .route(`${this.routeparent}/categoria/:id`)
      .put(this.routesController.updateCategoria);
    app
      .route(`${this.routeparent}/categoria/:id`)
      .delete(this.routesController.removeCategoria);
    //-------SUB-CATEGORIAS--//
    app
      .route(`${this.routeparent}/subCategoria`)
      .post(this.routesController.createSubCategoria);
    app
      .route(`${this.routeparent}/subCategoria`)
      .get(this.routesController.getSubCategorias);
    app
      .route(`${this.routeparent}/subCategoria/:id`)
      .get(this.routesController.getSubCategoria);
    app
      .route(`${this.routeparent}/subCategoriaCod/:codigo`)
      .get(this.routesController.getSubCategoriaCod);
    app
      .route(`${this.routeparent}/subCategoria/:id`)
      .put(this.routesController.updateSubCategoria);
    app
      .route(`${this.routeparent}/subCategoria/:id`)
      .delete(this.routesController.removeSubCategoria);
    //-------PROVEEDORES--//
    app
      .route(`${this.routeparent}/proveedor`)
      .post(this.routesController.createProveedores);
    app
      .route(`${this.routeparent}/proveedor`)
      .get(this.routesController.getProveedoress);
    app
      .route(`${this.routeparent}/proveedor/:id`)
      .get(this.routesController.getProveedores);
    app
      .route(`${this.routeparent}/proveedorCod/:codigo`)
      .get(this.routesController.getProveedoresCod);
    app
      .route(`${this.routeparent}/proveedor/:id`)
      .put(this.routesController.updateProveedores);
    app
      .route(`${this.routeparent}/proveedor/:id`)
      .delete(this.routesController.removeProveedores);
  }
}
export default Routes;
