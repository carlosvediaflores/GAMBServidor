import ptdiModule, { IPtdi } from "../models/ptdi";

class BussPtdi {
  constructor() {}
  public async readPtdi(): Promise<Array<IPtdi>>;
  public async readPtdi(id: string): Promise<IPtdi>;
  public async readPtdi(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPtdi>>;

  public async readPtdi(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPtdi> | IPtdi> {
    if (params1 && typeof params1 == "string") {
      var result: IPtdi = await ptdiModule
        .findOne({ _id: params1 })
        .populate("usuario")
        .populate("ley");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPtdi: Array<IPtdi> = await ptdiModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario")
        .populate("ley");
      return listPtdi;
    } else {
      let listPtdi: Array<IPtdi> = await ptdiModule
        .find()
        .populate("usuario")
        .populate("ley");
      return listPtdi;
    }
  }
  public async total({}) {
    var result = await ptdiModule.count();
    return result;
  }
  public async readPtdiFile(archivo: string): Promise<IPtdi>;
  public async readPtdiFile(
    params1?: string | any,
  ): Promise<Array<IPtdi> | IPtdi> {
    if (params1 && typeof params1 == "string") {
      var result: IPtdi = await ptdiModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async search(query?: any): Promise<Array<IPtdi>>;
  public async search(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { descripcion: { $regex: search, $options: "i" } }
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listPtdi: Array<IPtdi> = await ptdiModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("usuario")
      .populate("ley");
    return listPtdi;
  }
  public async addPtdi(Ptdi: IPtdi) {
    try {
      let PtdiDb = new ptdiModule(Ptdi);
      let result = await PtdiDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePtdi(id: string, Ptdi: any) {
    let result = await ptdiModule.updateOne({ _id: id }, { $set: Ptdi });
    return result;
  }
  public async deletePtdi(id: string) {
    let result = await ptdiModule.remove({ _id: id });
    return result;
  }
}
export default BussPtdi;
