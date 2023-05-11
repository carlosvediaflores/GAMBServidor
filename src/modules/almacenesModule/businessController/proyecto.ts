import proyectoModel, { IProyecto } from "../models/proyecto";
class BussProyecto {
  constructor() {}
  public async readProyecto(): Promise<Array<IProyecto>>;
  public async readProyecto(id: string): Promise<IProyecto>;
  public async readProyecto(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IProyecto>>;

  public async readProyecto(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IProyecto> | IProyecto> {
    if (params1 && typeof params1 == "string") {
      var result: IProyecto = await (await proyectoModel.findOne({ _id: params1 })).populate("id_programa");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listProyecto: Array<IProyecto> = await proyectoModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("id_programa");
      return listProyecto;
    } else {
      let listProyecto: Array<IProyecto> = await proyectoModel.find().populate("id_programa");
      return listProyecto;
    }
  }
  public async searchProy(query?: any): Promise<Array<IProyecto>>;
  public async searchProy(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listProyecto: Array<IProyecto> = await proyectoModel.find(filter).sort({ _id: -1 })
    return listProyecto;
  }
  public async readProyectoCod(codigo: string | any): Promise<IProyecto>;
  public async readProyectoCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IProyecto> | IProyecto> {
    if (params1 && typeof params1 == "string") {
      var result: IProyecto = await proyectoModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addProyecto(Proyecto: IProyecto) {
    try {
      let ProyectoDb = new proyectoModel(Proyecto);
      let result = await ProyectoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateProyecto(id: string, Proyecto: any) {
    let result = await proyectoModel.updateOne({ _id: id }, { $set: Proyecto });
    return result;
  }
  public async deleteProyecto(id: string) {
    let result = await proyectoModel.remove({ _id: id });
    return result;
  }
}
export default BussProyecto;
