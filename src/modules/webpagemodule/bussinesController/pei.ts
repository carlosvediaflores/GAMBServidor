import peiModule, { IPei } from "../models/pei";

class BussPei {
  constructor() {}
  public async readPei(): Promise<Array<IPei>>;
  public async readPei(id: string): Promise<IPei>;
  public async readPei(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPei>>;

  public async readPei(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPei> | IPei> {
    if (params1 && typeof params1 == "string") {
      var result: IPei = await peiModule
        .findOne({ _id: params1 })
        .populate("usuario")
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPei: Array<IPei> = await peiModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario")
      return listPei;
    } else {
      let listPei: Array<IPei> = await peiModule
        .find()
        .populate("usuario")
      return listPei;
    }
  }
  public async total({}) {
    var result = await peiModule.countDocuments();
    return result;
  }
  public async readPeiFile(archivo: string): Promise<IPei>;
  public async readPeiFile(
    params1?: string | any,
  ): Promise<Array<IPei> | IPei> {
    if (params1 && typeof params1 == "string") {
      var result: IPei = await peiModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async search(query?: any): Promise<Array<IPei>>;
  public async search(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { descripcion: { $regex: search, $options: "i" } },
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listPei: Array<IPei> = await peiModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("usuario")
    return listPei;
  }
  public async addPei(Pei: IPei) {
    try {
      let PeiDb = new peiModule(Pei);
      let result = await PeiDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePei(id: string, Pei: any) {
    let result = await peiModule.updateOne({ _id: id }, { $set: Pei });
    return result;
  }
  public async deletePei(id: string) {
    let result = await peiModule.remove({ _id: id });
    return result;
  }
}
export default BussPei;
