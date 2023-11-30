import compraModel, { ICompra } from "../models/compras";
import salidaModel, { ISalida } from "../models/salida";
class BussCompra {
  constructor() {}
  public async readCompra(): Promise<Array<ICompra>>;
  public async readCompra(id: string): Promise<ICompra>;
  public async readCompra(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ICompra>>;

  public async readCompra(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ICompra> | ICompra> {
    if (params1 && typeof params1 == "string") {
      var result: ICompra = await compraModel
        .findOne({ _id: params1 })
        .populate("idArticulo")
        .populate("idEntrada")
        .populate({
          path: "salidas",
          model: "alm_salidas",
          populate:{
            path:"idEgreso",
            model:"alm_egresos"
          }
        })
        .populate({
          path: "vehiculo",
          model: "alm_vehiculos",
          populate: {
            path: "idChofer",
            model: "User",
          },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listCompra: Array<ICompra> = await compraModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idArticulo")
        .populate("idEntrada")
        .populate({
          path: "salidas",
          model: "alm_salidas",
          populate:{
            path:"idEgreso",
            model:"alm_egresos"
          }
        })
        .populate({
          path: "vehiculo",
          model: "alm_vehiculos",
          populate: {
            path: "idChofer",
            model: "User",
          },
        });
      return listCompra;
    } else {
      let listCompras: Array<ICompra> = await compraModel
        .find()
        .populate("idArticulo")
        .populate("idEntrada")
        .populate({
          path: "salidas",
          model: "alm_salidas",
          populate:{
            path:"idEgreso",
            model:"alm_egresos"
          }
        })
        .populate({
          path: "vehiculo",
          model: "alm_vehiculos",
          populate: {
            path: "idChofer",
            model: "User",
          },
        });
      return listCompras;
    }
  }
  public async getNumCompra() {
    var result = await compraModel.find().limit(1).sort({ _id: -1 });
    return result;
  }
  public async total({}) {
    var result = await compraModel.countDocuments();
    return result;
  }
  public async totalCount(params1?: string | any) {
    let listSegui = await compraModel.countDocuments(params1);
    return listSegui;
  }
  public async searchCompraAll(query1?: any, query2?: any,): Promise<Array<ICompra>>;
  public async searchCompraAll(search1: string | any, search2: string | any ) {
    let listCompra: Array<ICompra> = await compraModel
      .find(search1)
      .sort({ createdAt: -1 })
      .populate({
        path: "idArticulo",
        match: search2,          
      })
      .populate({
        path: "idEntrada",
        model: "alm_ingresos",
        populate: {
          path: "idProveedor",
          model: "alm_proveedores",
        },
      });
   // return listCompra;
    const filterCompra = listCompra.filter((compra: any) => {
      return compra.idArticulo != null;
    });
    return filterCompra;
  }
  /* public async searchCompraAll(query?: any): Promise<Array<ICompra>>;
  public async searchCompraAll(search: string | any) {
    var filter = {
      $or: [
        { catProgra: { $regex: search, $options: "i" } },
        { factura: { $regex: search, $options: "i" } },
        { estadoCompra: { $regex: search, $options: "i" } }, 
      ],
    };
    console.log(filter.$or)
    let listCompra: Array<ICompra> = await compraModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("idEntrada")
      .populate({
        path: "idArticulo",
        model: "alm_articulos",
        populate: {
          path: "idPartida",
          model: "partidas",
        },
      });
    return listCompra;
  } */

  public async searchCompra(search:string) {
    let listCompra: any  = await compraModel
    .find({estadoCompra:'EXISTE', idProducto:search})
    .sort({ createdAt: -1 })
    .populate("idArticulo")
    .populate("idEntrada")
    .populate({
      path: "idArticulo",
      model: "alm_articulos",
      populate: {
        path: "idPartida",
        model: "partidas",
      },
    });
    
  return listCompra;
  }
  public async queryCompraCatPro(search: string) {
    let listCompra: any = await compraModel
      .find()
      .populate({
        path: "productos",
        match: {
          $or: [
            { catProgra: { $regex: search, $options: "i" } },
          ],
        },
      })
      .populate("idProveedor")
      .populate("idPersona")
      .sort({ createdAt: -1 })
      .exec();
    const filterProveedores = listCompra.filter((proveedor: any) => {
      return proveedor.idProveedor != null;
    });
    return filterProveedores;
  }
  public async queryCompraSaldo(query1?: any, query2?: any,): Promise<Array<ICompra>>;
  public async queryCompraSaldo(search1: string | any, search2: string | any ) {
    console.log(search1,search2);
    
    let listCompra: Array<ICompra> = await compraModel
      .find(search1)
      .sort({ createdAt: -1 })
      .populate({
        path: "idEntrada",
        match: search2,          
      })
      .populate({
        path: "idArticulo",
        model: "alm_articulos",
        populate: {
          path: "idPartida",
          model: "partidas",
        },
      });
   // return listCompra;
    const filterSaldo = listCompra.filter((saldo: any) => {
      return saldo.idEntrada != null;
    });
    return filterSaldo;
  }
  /* public async queryCompraSaldo(search1: string , search2?: string ) {
    console.log(search1);
    
    let listCompra: any = await compraModel
      .find({catProgra:search2})
      .populate({
        path: "idEntrada",
        match: {
         tipo:search1,
         concepto:"Saldo Inicial 2023",
        },
        //select: 'tipo concepto'
      })
      .populate("idProveedor")
      .populate("idPersona")
      .sort({ createdAt: -1 })
      .exec();
     // return listCompra;
      const filterSaldo = listCompra.filter((saldo: any) => {
        return saldo.idEntrada != null;
      });
      return filterSaldo;
  } */

  public async addCompra(Compra: ICompra) {
    try {
      let CompraDb = new compraModel(Compra);
      let result = await CompraDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateCompra(id: string, Compra: any) {
    let result = await compraModel.updateOne({ _id: id }, { $set: Compra });
    return result;
  }
  public async deleteCompra(id: string) {
    let result = await compraModel.remove({ _id: id });
    return result;
  }
  public async addSalidas(idCompra: string, idSalida: string) {
    let compra = await compraModel.findOne({ _id: idCompra });
    if (compra != null) {
      var salida = await salidaModel.findOne({ _id: idSalida });
      if (salida != null) {
        var checkrol: Array<ISalida> = compra.salidas.filter((item) => {
          if (salida._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          compra.salidas.push(salida);
          return await compra.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
}
export default BussCompra;
