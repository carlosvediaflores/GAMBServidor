import EgresosModel, { IEgreso } from "../models/egreso";
import salidaModel, { ISalida } from "../models/salida";
class BussEgreso {
  constructor() {}
  public async readEgreso(): Promise<Array<IEgreso>>;
  public async readEgreso(id: string): Promise<IEgreso>;
  public async readEgreso(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IEgreso>>;

  public async readEgreso(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IEgreso> | IEgreso> {
    if (params1 && typeof params1 == "string") {
      var result: IEgreso = await EgresosModel.findOne({ _id: params1 })
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idIngreso","numeroEntrada fecha")
        .populate({
          path: "productos",
          model: "alm_salidas",
          populate: {
            path: "idCompra",
            model: "alm_compras",
            populate: {
              path: "idArticulo",
              model: "alm_articulos",
              populate: { path: "idPartida", model: "partidas" },
            },
          },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEgreso: Array<IEgreso> = await EgresosModel.find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idIngreso","numeroEntrada fecha")
        .populate({
          path: "productos",
          model: "alm_salidas",
          populate: {
            path: "idCompra",
            model: "alm_compras",
            populate: {
              path: "idArticulo",
              model: "alm_articulos",
              populate: { path: "idPartida", model: "partidas" },
            },
          },
        });
      return listEgreso;
    } else {
      let listEgresos: Array<IEgreso> = await EgresosModel.find()
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idIngreso","numeroEntrada fecha")
        .populate({
          path: "productos",
          model: "alm_salidas",
          populate: {
            path: "idCompra",
            model: "alm_compras",
            populate: {
              path: "idArticulo",
              model: "alm_articulos",
              populate: { path: "idPartida", model: "partidas" },
            },
          },
        });
      return listEgresos;
    }
  }
  public async getNumEgreso() {
    var result = await EgresosModel.findOne().limit(1).sort({_id: -1 });
    return result;
  }
  public async total({}) {
    var result = await EgresosModel.countDocuments();
    return result;
  }
  public async totalCount(params1?: string | any) {
    let listSegui = await EgresosModel.countDocuments(params1);
    return listSegui;
  }
  public async searchEgreso(query?: any): Promise<Array<IEgreso>>;
  public async searchEgreso(search: string | any) {
    var filter = {
      $or: [
        { numeroFactura: { $regex: search, $options: "i" } },
        { glosaSalida: { $regex: search, $options: "i" } },
        //{ unidadDeMedida: { $regex: search, $options: "i" } },
      ],
    };
    let listConvenio: Array<IEgreso> = await EgresosModel.find(filter)
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
  public async addEgreso(Egreso: IEgreso) {
    try {
      let EgresoDb = new EgresosModel(Egreso);
      let result = await EgresoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateEgreso(id: string, Egreso: any) {
    let result = await EgresosModel.updateOne({ _id: id }, { $set: Egreso });
    return result;
  }
  public async deleteEgreso(id: string) {
    let result = await EgresosModel.remove({ _id: id });
    return result;
  }
  public async addSalidas(idEgreso: string, idSalida: string) {
    let egreso = await EgresosModel.findOne({ _id: idEgreso });
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
  public async readEgresos(
    query1?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IEgreso>>;

  public async readEgresos(
    search1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ){
      let skip = params2;
      let limit = params3;
      let listEgreso: Array<IEgreso> = await EgresosModel
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
  ): Promise<Array<IEgreso>>;

  public async totales(
    search1?: string | any,
  ){
      let listEgreso: Array<IEgreso> = await EgresosModel
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
export default BussEgreso;
