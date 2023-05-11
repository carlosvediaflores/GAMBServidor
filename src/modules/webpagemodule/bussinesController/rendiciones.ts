import rendicionModule, { IRendicion } from "../models/rendiciones";

class BussRendicion {
  constructor() {}
  public async readRendicion(): Promise<Array<IRendicion>>;
  public async readRendicion(id: string): Promise<IRendicion>;
  public async readRendicion(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IRendicion>>;

  public async readRendicion(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IRendicion> | IRendicion> {
    if (params1 && typeof params1 == "string") {
      var result: IRendicion = await rendicionModule
        .findOne({ _id: params1 })
        .populate("usuario")
        .populate("ley");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listRendicion: Array<IRendicion> = await rendicionModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario")
        .populate("ley");
      return listRendicion;
    } else {
      let listRendicion: Array<IRendicion> = await rendicionModule
        .find()
        .populate("usuario")
        .populate("ley");
      return listRendicion;
    }
  }
  public async total({}) {
    var result = await rendicionModule.countDocuments();
    return result;
  }
  public async readRendicionFile(archivo: string): Promise<IRendicion>;
  public async readRendicionFile(
    params1?: string | any,
  ): Promise<Array<IRendicion> | IRendicion> {
    if (params1 && typeof params1 == "string") {
      var result: IRendicion = await rendicionModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async searchRendicion(query?: any): Promise<Array<IRendicion>>;
  public async searchRendicion(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { titulo: { $regex: search, $options: "i" } },
        { descripcion: { $regex: search, $options: "i" } },
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listRendicion: Array<IRendicion> = await rendicionModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ gestion: -1 })
      .populate("usuario")
      .populate("ley");
    return listRendicion;
  }
  public async addRendicion(Rendicion: IRendicion) {
    try {
      let RendicionDb = new rendicionModule(Rendicion);
      let result = await RendicionDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateRendicion(id: string, Rendicion: any) {
    let result = await rendicionModule.updateOne({ _id: id }, { $set: Rendicion });
    return result;
  }
  public async deleteRendicion(id: string) {
    let result = await rendicionModule.remove({ _id: id });
    return result;
  }
}
export default BussRendicion;
