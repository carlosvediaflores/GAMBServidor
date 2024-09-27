import ingresosModel, { IIngreso } from "../models/ingreso";
import compraModel, { ICompra } from "../models/compras";
import egresoModel, { IEgreso } from "../models/egreso";
import proveedores from "../models/proveedores";
class BussIngreso {
  constructor() {}
  public async readIngreso(): Promise<Array<IIngreso>>;
  public async readIngreso(id: string): Promise<IIngreso>;
  public async readIngreso(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IIngreso>>;

  public async readIngreso(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IIngreso> | IIngreso> {
    if (params1 && typeof params1 == "string") {
      var result: IIngreso = await ingresosModel
        .findOne({ _id: params1 })
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idEgreso")
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        })
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
            populate: { path: "idChofer", model: "User" },
          },
        });
      // .populate("productos");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listIngreso: Array<IIngreso> = await ingresosModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idEgreso")
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        })
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
            populate: { path: "idChofer", model: "User" },
          },
        });
      return listIngreso;
    } else {
      let listIngresos: Array<IIngreso> = await ingresosModel
        .find()
        .populate("idProveedor")
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idEgreso")
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: { path: "idArticulo", model: "alm_articulos" },
        })
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
            populate: { path: "idChofer", model: "User" },
          },
        });
      return listIngresos;
    }
  }
  
  public async getNumIngreso() {
    var result = await ingresosModel
      .find()
      .limit(1)
      .sort({ _id: -1 });
    return result;
  }
  public async getNumIngresoOne() {
    var result = await ingresosModel
      .findOne()
      .limit(1)
      .sort({ _id: -1 });
    return result;
  }
  public async total({}) {
    var result = await ingresosModel.countDocuments();
    return result;
  }
  public async totalCount(params1?: string | any) {
    let listSegui = await ingresosModel.countDocuments(params1);
    return listSegui;
  }
  public async searchIngreso(query?: any): Promise<Array<IIngreso>>;
  public async searchIngreso(search: string | any) {
    var filter = {
      $or: [
        { numeroFactura: { $regex: search, $options: "i" } },
        { categoriaProgra: { $regex: search, $options: "i" } },
        { concepto: { $regex: search, $options: "i" } },
        //{ unidadDeMedida: { $regex: search, $options: "i" } },
      ],
    };
    console.log(filter);
    let listConvenio: Array<IIngreso> = await ingresosModel
      .find(filter)
      .sort({ _id: -1 })
      .populate("idProveedor")
      .populate("idUsuario")
      .populate("idPersona")
      .populate("idEgreso")
      .populate({
        path: "productos",
        model: "alm_compras",
        populate: { path: "idArticulo", model: "alm_articulos" },
      })
      .populate({
        path: "productos",
        model: "alm_compras",
        populate: {
          path: "vehiculo",
          model: "alm_vehiculos",
          populate: { path: "idChofer", model: "User" },
        },
      });
    return listConvenio;
  }
  public async queryIngresoPersona(search: string) {
    let listIngreso: any = await ingresosModel
      .find()
      .populate({
        path: "idPersona",
        match: {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { post: { $regex: search, $options: "i" } },
          ],
        },
      })
      .populate("productos")
      .populate("idProveedor")
      .sort({ createdAt: -1 })
      .exec();
    const filterProveedores = listIngreso.filter((persona: any) => {
      return persona.idPersona != null;
    });
    return filterProveedores;
  }
  public async queryIngresoProveedor(search: string) {
    let listIngreso: any = await ingresosModel
      .find()
      .populate({
        path: "idProveedor",
        match: {
          $or: [
            { razon_social: { $regex: search, $options: "i" } },
            { representante: { $regex: search, $options: "i" } },
            { nit: { $regex: search, $options: "i" } },
          ],
        },
      })
      .populate("productos")
      .populate("idPersona")
      .sort({ createdAt: -1 })
      .exec();
    const filterProveedores = listIngreso.filter((proveedor: any) => {
      return proveedor.idProveedor != null;
    });
    return filterProveedores;
  }
  public async queryIngresoCompra(search: string) {
    let listIngreso: any = await ingresosModel
      .find()
      .populate({
        path: "productos",
        match: {'numeroEntrada': { $eq: search } }
      })
      .populate("idProveedor")
      .populate("idPersona")
      .sort({ createdAt: -1 })
      .exec();
    const filterProveedores = listIngreso.filter((proveedor: any) => {
      return proveedor.productos != null;
    });
    return filterProveedores;
  }
  public async addIngreso(Ingreso: IIngreso) {
    try {
      let IngresoDb = new ingresosModel(Ingreso);
      let result = await IngresoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateIngreso(id: string, Ingreso: any) {
    let result = await ingresosModel.updateOne({ _id: id }, { $set: Ingreso });
    return result;
  }
  public async deleteIngreso(id: string) {
    let result = await ingresosModel.remove({ _id: id });
    return result;
  }
  public async addCompras(idIngreso: string, idCompra: string) {
    let ingreso = await ingresosModel.findOne({ _id: idIngreso });
    if (ingreso != null) {
      var compra = await compraModel.findOne({ _id: idCompra });
      if (compra != null) {
        var checkrol: Array<ICompra> = ingreso.productos.filter((item) => {
          if (compra._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          ingreso.productos.push(compra);
          return await ingreso.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async addEgresos(idIngreso: string, idEgreso: string) {
    let ingreso = await ingresosModel.findOne({ _id: idIngreso });
    if (ingreso != null) {
      var egreso = await egresoModel.findOne({ _id: idEgreso });
      if (egreso != null) {
        var checkrol: Array<IEgreso> = ingreso.idEgreso.filter((item) => {
          if (egreso._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          ingreso.idEgreso.push(egreso);
          return await ingreso.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }

  public async readIngresos(
    query1?: any,
    query2?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IIngreso>>;

  public async readIngresos(
    search1?: string | any,
    search2?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ){
      let skip = params2;
      let limit = params3;
      let listIngreso: Array<IIngreso> = await ingresosModel
        .find(search1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate({
          path: "idProveedor",
          match: search2,          
        })
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idEgreso")
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        })
      //return listIngreso;
      const filterIngreso = listIngreso.filter((ingreso: any) => {
        return ingreso.idProveedor != null;
      });
      return filterIngreso;
  } 
  public async totales(
    query1?: any,
    query2?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IIngreso>>;

  public async totales(
    search1?: string | any,
    search2?: string | any,
  ){
      let listIngreso: Array<IIngreso> = await ingresosModel
        .find(search1)
        .populate({
          path: "idProveedor",
          match: search2,          
        })
        .populate("idUsuario")
        .populate("idPersona")
        .populate("idEgreso")
        .populate({
          path: "productos",
          model: "alm_compras",
          populate: {
            path: "idArticulo",
            model: "alm_articulos",
            populate: { path: "idPartida", model: "partidas" },
          },
        })
      //return listIngreso;
      const filterIngreso = listIngreso.filter((ingreso: any) => {
        return ingreso.idProveedor != null;
      });
      return filterIngreso;
  } 
}
export default BussIngreso;
