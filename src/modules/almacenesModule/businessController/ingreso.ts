import ingresosModel, { IIngreso } from "../models/ingreso";
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
    order?:any
  ): Promise<Array<IIngreso> | IIngreso> {
    if (params1 && typeof params1 == "string") {
      var result: IIngreso = await ingresosModel.findOne({ _id: params1 }).populate("idProveedor").populate("idUsuario");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listIngreso: Array<IIngreso> = await ingresosModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order).populate("idProveedor").populate("idUsuario");
      return listIngreso;
    } else {
      let listIngresos: Array<IIngreso> = await ingresosModel.find().populate("idProveedor").populate("idUsuario");
      return listIngresos;
    }
  }
  public async searchIngreso(query?: any): Promise<Array<IIngreso>>;
  public async searchIngreso(
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
    let listConvenio: Array<IIngreso> = await ingresosModel.find(filter).sort({ _id: -1 }).populate("idProveedor").populate("idUsuario");
    return listConvenio;
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
    let result = await ingresosModel.update({ _id: id }, { $set: Ingreso });
    return result;
  }
  public async deleteIngreso(id: string) {
    let result = await ingresosModel.remove({ _id: id });
    return result;
  }
}
export default BussIngreso;
