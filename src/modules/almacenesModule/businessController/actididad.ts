import actividadModel, { IActividad } from "../models/actividad";
class BussActividad {
  constructor() {}
  public async readActividad(): Promise<Array<IActividad>>;
  public async readActividad(id: string): Promise<IActividad>;
  public async readActividad(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IActividad>>;

  public async readActividad(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IActividad> | IActividad> {
    if (params1 && typeof params1 == "string") {
      var result: IActividad = await actividadModel.findOne({ _id: params1 }).populate("id_programa");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listActividad: Array<IActividad> = await actividadModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("id_programa");
      return listActividad;
    } else {
      let listActividad: Array<IActividad> = await actividadModel.find().populate("id_programa");
      return listActividad;
    }
  }
  public async searchActividad(query?: any): Promise<Array<IActividad>>;
  public async searchActividad(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listActividad: Array<IActividad> = await actividadModel.find(filter).sort({ _id: -1 })
    return listActividad;
  }
  public async readActividadCod(codigo: string | any): Promise<IActividad>;
  public async readActividadCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IActividad> | IActividad> {
    if (params1 && typeof params1 == "string") {
      var result: IActividad = await actividadModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addActividad(Actividad: IActividad) {
    try {
      let ActividadDb = new actividadModel(Actividad);
      let result = await ActividadDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateActividad(id: string, Actividad: any) {
    let result = await actividadModel.update({ _id: id }, { $set: Actividad });
    return result;
  }
  public async deleteActividad(id: string) {
    let result = await actividadModel.remove({ _id: id });
    return result;
  }
}
export default BussActividad;
