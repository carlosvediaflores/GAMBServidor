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
    app
      .route(`${this.routeparent}/searchCat/:search`)
      .get(this.routesController.searchCat);
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
    app
      .route(`${this.routeparent}/searchSubCat/:search`)
      .get(this.routesController.searchSubCategoria);
    //-------PROVEEDORES--//
    app
      .route(`${this.routeparent}/proveedor`)
      .post(this.routesController.createProveedores);
    app
      .route(`${this.routeparent}/proveedores`)
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
    app
      .route(`${this.routeparent}/searchProveedor/:search`)
      .get(this.routesController.searchProveedor);
    //-------PROGRAMA--//
    app
      .route(`${this.routeparent}/programa`)
      .post(this.routesController.createPrograma);
    app
      .route(`${this.routeparent}/programas`)
      .get(this.routesController.getProgramas);
    app
      .route(`${this.routeparent}/programa/:id`)
      .get(this.routesController.getPrograma);
    app
      .route(`${this.routeparent}/programaCod/:codigo`)
      .get(this.routesController.getProgramaCod);
    app
      .route(`${this.routeparent}/programa/:id`)
      .put(this.routesController.updatePrograma);
    app
      .route(`${this.routeparent}/programa/:id`)
      .delete(this.routesController.removePrograma);
    app
      .route(`${this.routeparent}/searchProg/:search`)
      .get(this.routesController.searchProg);
    //-------PROYECTO--//
    app
      .route(`${this.routeparent}/proyecto`)
      .post(this.routesController.createProyecto);
    app
      .route(`${this.routeparent}/proyectos`)
      .get(this.routesController.getProyectos);
    app
      .route(`${this.routeparent}/proyecto/:id`)
      .get(this.routesController.getProyecto);
    app
      .route(`${this.routeparent}/proyectoCod/:codigo`)
      .get(this.routesController.getProyectoCod);
    app
      .route(`${this.routeparent}/proyecto/:id`)
      .put(this.routesController.updateProyecto);
    app
      .route(`${this.routeparent}/proyecto/:id`)
      .delete(this.routesController.removeProyecto);
    app
      .route(`${this.routeparent}/searchProy/:search`)
      .get(this.routesController.searchProy);
    //-------ACTIVIDAD--//
    /* app
      .route(`${this.routeparent}/actividad`)
      .post(this.routesController.createActividad);
    app
      .route(`${this.routeparent}/actividades`)
      .get(this.routesController.getActividades);
    app
      .route(`${this.routeparent}/actividad/:id`)
      .get(this.routesController.getActividad);
    app
      .route(`${this.routeparent}/actividadCod/:codigo`)
      .get(this.routesController.getActividadCod);
    app
      .route(`${this.routeparent}/actividad/:id`)
      .put(this.routesController.updateActividad);
    app
      .route(`${this.routeparent}/actividad/:id`)
      .delete(this.routesController.removeActividad);
    app
      .route(`${this.routeparent}/searchActividad/:search`)
      .get(this.routesController.searchActividad); */
    //--------------CSV--------------//
    app
      .route(`${this.routeparent}/excel`)
      .post(this.routesController.uploadExcelSegPoa);
    app
      .route(`${this.routeparent}/csv`)
      .post(this.routesController.uploadCsvPoa);
    app
      .route(`${this.routeparent}/segPoa`)
      .post(this.routesController.createSegPoa);
    app
      .route(`${this.routeparent}/segPoas`)
      .get(this.routesController.readSegPoa);
    app
      .route(`${this.routeparent}/catProg`)
      .get(this.routesController.getCatProg);
    app
      .route(`${this.routeparent}/searchSegPoa/:search`)
      .get(this.routesController.searchSegPoa);
    //-------ARTICULOS--//
    app
      .route(`${this.routeparent}/articulo`)
      .post(this.routesController.createArticulo);
    app
      .route(`${this.routeparent}/articulos`)
      .get(this.routesController.getArticulos);
    app
      .route(`${this.routeparent}/articulo/:id`)
      .get(this.routesController.getArticulo);
    app
      .route(`${this.routeparent}/articuloCod/:codigo`)
      .get(this.routesController.getArticuloCod);
    app
      .route(`${this.routeparent}/articulo/:id`)
      .put(this.routesController.updateArticulo);
    app
      .route(`${this.routeparent}/articulo/:id`)
      .delete(this.routesController.removeArticulo);
    app
      .route(`${this.routeparent}/searchArticulo/:search`)
      .get(this.routesController.searchArticulo);
    app
      .route(`${this.routeparent}/searchArticulos/:search`)
      .get(this.routesController.searchArticulos);
    app
      .route(`${this.routeparent}/articuloNombre`)
      .get(this.routesController.getArticuloNombre);
    app
      .route(`${this.routeparent}/searchArticulosAll`)
      .get(this.routesController.searchArticulosAll);
    //-------MEDIDAS--//
    app
      .route(`${this.routeparent}/medida`)
      .post(this.routesController.createMedida);
    app
      .route(`${this.routeparent}/medidas`)
      .get(this.routesController.getMedidas);
    app
      .route(`${this.routeparent}/medida/:id`)
      .get(this.routesController.getMedida);
    app
      .route(`${this.routeparent}/medida/:id`)
      .put(this.routesController.updateMedida);
    app
      .route(`${this.routeparent}/medida/:id`)
      .delete(this.routesController.removeMedida);
    app
      .route(`${this.routeparent}/searchmedida/:search`)
      .get(this.routesController.searchMedida);
    //-------INGRESOS--//
    app
      .route(`${this.routeparent}/ingreso`)
      .post(this.routesController.createIngreso);
    app
      .route(`${this.routeparent}/ingresos`)
      .get(this.routesController.getIngresos);
    app
      .route(`${this.routeparent}/ingreso/:id`)
      .get(this.routesController.getIngreso);
    app
      .route(`${this.routeparent}/ingreso/:id`)
      .put(this.routesController.updateIngreso);
    app
      .route(`${this.routeparent}/ingreso/:id`)
      .delete(this.routesController.removeIngreso);
    app
      .route(`${this.routeparent}/searchingreso/:search`)
      .get(this.routesController.searchIngreso);
    app
      .route(`${this.routeparent}/queryIngresoPersona/:search`)
      .get(this.routesController.queryIngresoPersona);
    app
      .route(`${this.routeparent}/queryIngresoProveedor/:search`)
      .get(this.routesController.queryIngresoProveedor);
    app
      .route(`${this.routeparent}/queryIngresoCompra/:search`)
      .get(this.routesController.queryIngresoCompra);
    //-------EGRESOS--//
    app
      .route(`${this.routeparent}/egreso`)
      .post(this.routesController.createEgreso);
    app
      .route(`${this.routeparent}/egresos`)
      .get(this.routesController.getEgresos);
    app
      .route(`${this.routeparent}/egreso/:id`)
      .get(this.routesController.getEgreso);
    app
      .route(`${this.routeparent}/egreso/:id`)
      .put(this.routesController.updateEgreso);
    app
      .route(`${this.routeparent}/egreso/:id`)
      .delete(this.routesController.removeEgreso);
    app
      .route(`${this.routeparent}/searchegreso/:search`)
      .get(this.routesController.searchEgreso);
    //////////COUNTER
    app
      .route(`${this.routeparent}/almPartidas`)
      .get(this.routesController.partidasAlm);
    app
      .route(`${this.routeparent}/partidaAlm`)
      .post(this.routesController.createPartida);
    app
      .route(`${this.routeparent}/egresoya/:id`)
      .put(this.routesController.egreso);
    //-------COMPRAS--//
    app
      .route(`${this.routeparent}/compra`)
      .post(this.routesController.createCompra);
    app
      .route(`${this.routeparent}/compras`)
      .get(this.routesController.getCompras);
    app
      .route(`${this.routeparent}/compra/:id`)
      .get(this.routesController.getCompra);
    app
      .route(`${this.routeparent}/compra/:id`)
      .put(this.routesController.updateCompra);
    /* app
      .route(`${this.routeparent}/compra`)
      .put(this.routesController.updateCompraAll); */
    app
      .route(`${this.routeparent}/compra/:id`)
      .delete(this.routesController.removeCompra);
    app
      .route(`${this.routeparent}/searchCompra/:search?`)
      .get(this.routesController.searchCompra);
      app
      .route(`${this.routeparent}/searchCombustible/:articulo?/:catProgra?`)
      .get(this.routesController.searchCombustible);
    app
      .route(`${this.routeparent}/queryCompraCatPro/:search`)
      .get(this.routesController.queryCompraCatPro);
    app
      .route(`${this.routeparent}/searchCompraAll`)
      .get(this.routesController.searchCompraAll);
    app
      .route(`${this.routeparent}/searchCompraSaldo`)
      .get(this.routesController.queryCompraSaldo);
    //------------CONUNT--------------
    app
      .route(`${this.routeparent}/countAlmacenes`)
      .get(this.routesController.contAlmacenes);

    //------OTROS-------------//
    app
      .route(`${this.routeparent}/cierreGestion`)
      .get(this.routesController.cierreGestion);

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
      .route(`${this.routeparent}/listAutorizacion`)
      .get(this.routesController.listAutorizacion);
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
 

    //-------Vales--//
    //crear
    app
      .route(`${this.routeparent}/vale`)
      .post(this.routesController.createVale);
      //listar
    app
      .route(`${this.routeparent}/vales`)
      .get(this.routesController.getVales);
       //listar
    app
    .route(`${this.routeparent}/valesAll`)
    .get(this.routesController.getValesAll);
      //buscar vale por ID
    app
      .route(`${this.routeparent}/finalizarVales`)
      .post(this.routesController.setVales);
    app
      .route(`${this.routeparent}/vale/:id`)
      .get(this.routesController.getVale);
       //editar vale por ID
    app
      .route(`${this.routeparent}/vale/:id`)
      .put(this.routesController.updateVale);
      //eliminar vale por ID
    app
      .route(`${this.routeparent}/vale/:id`)
      .delete(this.routesController.deleteVale);
    //agregar factura a vale
    app
      .route(`${this.routeparent}/addFactura/:id`)
      .put(this.routesController.addFactura);
  }
}
export default Routes;
