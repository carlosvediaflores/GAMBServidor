
import pedidosModel, { IPedidos } from "../models/pedidos";
import salidaModel, { ISalida } from "../models/salida";
class BussPedidos {
  constructor() {}
  public async readPedidos(): Promise<Array<IPedidos>>;
  public async readPedidos(id: string): Promise<IPedidos>;
  public async readPedidos(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPedidos>>;

  public async readPedidos(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPedidos> | IPedidos> {
    if (params1 && typeof params1 == "string") {
      var result: IPedidos = await pedidosModel.findOne({ _id: params1 })
        // .populate("idProveedor")
        // .populate("idUsuario")
        // .populate("idPersona")
        // .populate("idIngreso","numeroEntrada fecha")
        // .populate({
        //   path: "productos",
        //   model: "alm_salidas",
        //   populate: {
        //     path: "idCompra",
        //     model: "alm_compras",
        //     populate: {
        //       path: "idArticulo",
        //       model: "alm_articulos",
        //       populate: { path: "idPartida", model: "partidas" },
        //     },
        //   },
        // });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEgreso: Array<IPedidos> = await pedidosModel.find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        // .populate("idProveedor")
        // .populate("idUsuario")
        // .populate("idPersona")
        // .populate("idIngreso","numeroEntrada fecha")
        // .populate({
        //   path: "productos",
        //   model: "alm_salidas",
        //   populate: {
        //     path: "idCompra",
        //     model: "alm_compras",
        //     populate: {
        //       path: "idArticulo",
        //       model: "alm_articulos",
        //       populate: { path: "idPartida", model: "partidas" },
        //     },
        //   },
        // });
      return listEgreso;
    } else {
      let listEgresos: Array<IPedidos> = await pedidosModel.find()
        // .populate("idProveedor")
        // .populate("idUsuario")
        // .populate("idPersona")
        // .populate("idIngreso","numeroEntrada fecha")
        // .populate({
        //   path: "productos",
        //   model: "alm_salidas",
        //   populate: {
        //     path: "idCompra",
        //     model: "alm_compras",
        //     populate: {
        //       path: "idArticulo",
        //       model: "alm_articulos",
        //       populate: { path: "idPartida", model: "partidas" },
        //     },
        //   },
        // });
      return listEgresos;
    }
  }
  public async getNumPedido() {
    var result = await pedidosModel.findOne().limit(1).sort({_id: -1 });
    return result;
  }
  public async total({}) {
    var result = await pedidosModel.countDocuments();
    return result;
  }
  public async totalCount(params1?: string | any) {
    let listSegui = await pedidosModel.countDocuments(params1);
    return listSegui;
  }
  public async searchEgreso(query?: any): Promise<Array<IPedidos>>;
  public async searchEgreso(search: string | any) {
    var filter = {
      $or: [
        { numeroFactura: { $regex: search, $options: "i" } },
        { glosaSalida: { $regex: search, $options: "i" } },
        //{ unidadDeMedida: { $regex: search, $options: "i" } },
      ],
    };
    let listConvenio: Array<IPedidos> = await pedidosModel.find(filter)
      .sort({ _id: -1 })
      .populate("idProveedor")
      .populate("idUsuario")
      .populate("idPersona")
      .populate({
        path: "productos",
        model: "alm_compras",
        populate: {
          path: "idArticulo",
          model: "alm_articulos",
          populate: { path: "idPartida", model: "partidas" },
        },
      });
    return listConvenio;
  }
  public async addPedido(pedido: IPedidos) {
    try {
      let pedidoDb = new pedidosModel(pedido);
      let result = await pedidoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateEgreso(id: string, Egreso: any) {
    let result = await pedidosModel.updateOne({ _id: id }, { $set: Egreso });
    return result;
  }
  public async deleteEgreso(id: string) {
    let result = await pedidosModel.remove({ _id: id });
    return result;
  }
  public async addSalidas(idEgreso: string, idSalida: string) {
    let egreso = await pedidosModel.findOne({ _id: idEgreso });
    if (egreso != null) {
      var salida = await salidaModel.findOne({ _id: idSalida });
      if (salida != null) {
        var checkrol: Array<ISalida> = egreso.productos.filter((item) => {
          if (salida._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          egreso.productos.push(salida);
          return await egreso.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async readPedidoss(
    query1?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IPedidos>>;

  public async readPedidoss(
    search1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ){
      let skip = params2;
      let limit = params3;
      let listEgreso: Array<IPedidos> = await pedidosModel
        .find(search1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idUsuario")
        .populate({
          path: "productos",
          model: "alm_salidas",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        })
      return listEgreso;
      /* const filterIngreso = listIngreso.filter((ingreso: any) => {
        return ingreso.idProveedor != null;
      });
      return filterIngreso; */
  } 

  public async totales(
    query1?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IPedidos>>;

  public async totales(
    search1?: string | any,
  ){
      let listEgreso: Array<IPedidos> = await pedidosModel
        .find(search1)
        .populate("idPersona")
        /* .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        }) */
      return listEgreso;
      /* const filterIngreso = listIngreso.filter((ingreso: any) => {
        return ingreso.idProveedor != null;
      });
      return filterIngreso; */
  } 
}
export default BussPedidos;
