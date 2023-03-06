import salidaModel, { ISalida } from "../models/salida";
class BussSalida {
  constructor() {}
  public async readSalida(): Promise<Array<ISalida>>;
  public async readSalida(id: string): Promise<ISalida>;
  public async readSalida(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ISalida>>;

  public async readSalida(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ISalida> | ISalida> {
    if (params1 && typeof params1 == "string") {
      var result: ISalida = await salidaModel
        .findOne({ _id: params1 })
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
        
        .populate("idSalida");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listSalida: Array<ISalida> = await salidaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idArticulo")
        .populate("idEntrada");
      return listSalida;
    } else {
      let listSalidas: Array<ISalida> = await salidaModel
        .find()
        .populate("idArticulo")
        .populate("idEntrada");
      return listSalidas;
    }
  }
  public async getNumSalida() {
    var result = await salidaModel.find().limit(1).sort({ _id: -1 });
    return result;
  }
  /* public async searchSalida(query?: any): Promise<Array<ISalida>>;
  public async searchSalida(search: string | any) {
    var filter = {
      $or: [
        { 'idArticulo._id': { $regex: search, $options: "i" } },
        /* { catProgra: { $regex: search, $options: "i" } },
        { factura: { $regex: search, $options: "i" } },
        { estadoSalida: { $regex: search, $options: "i" } }, 
      ],
    };
    console.log(filter.$or)
    let listSalida: Array<ISalida> = await salidaModel
      .find({ 'idArticulo.codigo': search })
      .sort({ createdAt: -1 })
      .populate("idArticulo")
      .populate("idEntrada");
    return listSalida;
  } */

  public async searchSalida(search:string) {
    let listSalida: any  = await salidaModel
    .find({estadoSalida:'EXISTE', idProducto:search})
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
    });;
    
  return listSalida;
  }
  

  public async addSalida(Salida: ISalida) {
    try {
      let SalidaDb = new salidaModel(Salida);
      let result = await SalidaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateSalida(id: string, Salida: any) {
    let result = await salidaModel.updateOne({ _id: id }, { $set: Salida });
    return result;
  }
  public async deleteSalida(id: string) {
    let result = await salidaModel.remove({ _id: id });
    return result;
  }
}
export default BussSalida;
