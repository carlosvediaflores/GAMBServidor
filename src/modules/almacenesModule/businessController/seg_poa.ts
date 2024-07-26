import segPoaModule, { ISegPoa } from "../models/seg_poa";

class BusSegPoa {
  constructor() {}
  public async readSegPoa(): Promise<Array<ISegPoa>>;
  public async readSegPoa(id: string): Promise<ISegPoa>;
  public async readSegPoa(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ISegPoa>>;

  public async readSegPoa(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ISegPoa> | ISegPoa> {
    if (params1 && typeof params1 == "string") {
      var result: ISegPoa = await segPoaModule
        .findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listSegPoa: Array<ISegPoa> = await segPoaModule
        .find(params1)
        .populate("responsable")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listSegPoa;
    } else {
      let listSegPoa: Array<ISegPoa> = await segPoaModule
        .find();
      return listSegPoa;
    }
  }
  public async total({}) {
    var result = await segPoaModule.countDocuments();
    return result;
  }
  public async searchSegPoa(query?: any): Promise<Array<ISegPoa>>;
  public async searchSegPoa(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
      $or: [
        { proyect_acti: { $regex: search, $options: "i" } },
        { cat_programatica: { $regex: search, $options: "i" } },
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listSegPoa: Array<ISegPoa> = await segPoaModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    return listSegPoa;
  }
  public async getCatProg (){
    let result: Array<ISegPoa> = await segPoaModule.find();
    return result;
  }
  public async addSegPoa(SegPoa: ISegPoa) {
    try {
      let SegPoaDb = new segPoaModule(SegPoa);
      let result = await SegPoaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addsegPoa(segPoa: ISegPoa) {
    try {
      let segPoaDb = new segPoaModule(segPoa);
      let result = await segPoaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addSegPoaCsv(SegPoa: any) {
    let result = await segPoaModule.insertMany( SegPoa );
    return result
  }
  public async updateSegPoa(id: string, SegPoa: any) {
    let result = await segPoaModule.updateOne({ _id: id }, { $set: SegPoa });
    return result;
  }
  public async deleteSegPoa(id: string) {
    let result = await segPoaModule.deleteOne({ _id: id });
    return result;
  }
}
export default BusSegPoa;
