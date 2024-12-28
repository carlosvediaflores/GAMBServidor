import valeModel, { IVale } from "../models/vale";
class BussVale {
  constructor() {}
  public async readVale(): Promise<Array<IVale>>;
  public async readVale(id: string): Promise<IVale>;
  public async readVale(
    query?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IVale>>;

  public async readVale(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IVale> | IVale> {
    if (params1 && typeof params1 == "string") {
      var result: IVale = await valeModel
        .findOne({ _id: params1 })
        .populate("encargadoControl", "_id ci email username surnames roles")
        .populate("idFacturas")
        .populate({
          path: "conductor",
          model: "User",
          select: "_id ci email username surnames roles",
          populate: {
            path: "cargo",
            model: "Subdirecciones",
            select: "_id nombresubdir unidad ",
          },
        })
        .populate("vehiculo")
        .populate("idProducto")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "unidadSolicitante",
            model: "Subdirecciones",
            populate: { path: "user", model: "User", select: "_id ci email username surnames roles", },
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "conductor",
            model: "User",
            select: "_id ci email username surnames roles",
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
          },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listVale: Array<IVale> = await valeModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idFacturas")
        .populate("encargadoControl", "_id ci email username surnames roles")
        .populate({
          path: "conductor",
          model: "User",
          select: "_id ci email username surnames roles",
          populate: {
            path: "cargo",
            model: "Subdirecciones",
            select: "_id nombresubdir unidad ",
          },
        })
        .populate("vehiculo")
        .populate("idProducto")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "unidadSolicitante",
            model: "Subdirecciones",
            populate: { path: "user", model: "User", select: "_id ci email username surnames roles", },
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "conductor",
            model: "User",
            select: "_id ci email username surnames roles",
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
          },
        });

      return listVale;
    } else {
      let listVale: Array<IVale> = await valeModel
        .find()
        .populate("id_programa");
      return listVale;
    }
  }
  public async addVale(Vale: any) {
    try {
      let ValeDb = new valeModel(Vale);
      let result = await ValeDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async getVales(params1:any, params2?:any) {
    var result = await valeModel.find(params1)
    .populate("idProducto");
    return result;
  }
  public async getNumVale() {
    var result = await valeModel.findOne().limit(1).sort({ _id: -1 });
    return result;
  }
  public async updateVale(id: string, Vale: any) {
    let result = await valeModel.updateOne({ _id: id }, { $set: Vale });
    return result;
  }
  public async deleteVale(id: string) {
    let result = await valeModel.deleteOne({ _id: id });
    return result;
  }
  public async updatePushFactura(id: string, factura: any) {
    let result = await valeModel.updateOne({ _id: id }, { $push: factura });
    return result;
  }
   public async getValeAntiguo(numAntiguo: string) {     
      let result = await valeModel.findOne({numAntiguo:numAntiguo})
      return result;
    }
}
export default BussVale;
