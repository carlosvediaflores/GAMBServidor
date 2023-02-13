import EgresosModel, { IEgreso } from "../models/egreso";
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
    order?:any
  ): Promise<Array<IEgreso> | IEgreso> {
    if (params1 && typeof params1 == "string") {
      var result: IEgreso = await EgresosModel.findOne({ _id: params1 }).populate("idProveedor").populate("idUsuario");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEgreso: Array<IEgreso> = await EgresosModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order).populate("idProveedor").populate("idUsuario");
      return listEgreso;
    } else {
      let listEgresos: Array<IEgreso> = await EgresosModel.find().populate("idProveedor").populate("idUsuario");
      return listEgresos;
    }
  }
  public async searchEgreso(query?: any): Promise<Array<IEgreso>>;
  public async searchEgreso(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { numeroFactura: { $regex: search, $options: "i" } },
        { categoriaProgra: { $regex: search, $options: "i" } },
        { concepto: { $regex: search, $options: "i" } },
        //{ unidadDeMedida: { $regex: search, $options: "i" } },
      ],
    };
    let listConvenio: Array<IEgreso> = await EgresosModel.find(filter).sort({ _id: -1 }).populate("idProveedor").populate("idUsuario");
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
    let result = await EgresosModel.update({ _id: id }, { $set: Egreso });
    return result;
  }
  public async deleteEgreso(id: string) {
    let result = await EgresosModel.remove({ _id: id });
    return result;
  }
}
export default BussEgreso;
