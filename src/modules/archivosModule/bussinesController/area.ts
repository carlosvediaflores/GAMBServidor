import areaModel, { IArea } from "../models/area";
class BussArea {
  constructor() {}
  public async readArea(): Promise<Array<IArea>>;
  public async readArea(id: string): Promise<IArea>;
  public async readArea(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IArea>>;

  public async readArea(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IArea> | IArea> {
    if (params1 && typeof params1 == "string") {
      var result: IArea = await areaModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listArea: Array<IArea> = await areaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listArea;
    } else {
      let listAreas: Array<IArea> = await areaModel.find();
      return listAreas;
    }
  }
  public async total({}) {
    var result = await areaModel.countDocuments();
    return result;
  }
  public async searchArea(query?: any): Promise<Array<IArea>>;
  public async searchArea(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { nombre: { $regex: search, $options: "i" } },
      ],
    };
    let listArea: Array<IArea> = await areaModel.find(filter).sort({ _id: -1 });
    return listArea;
  }
  public async addArea(Area: IArea) {
    try {
      let AreaDb = new areaModel(Area);
      let result = await AreaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addTipo(idArea: string, tipo: any) {
    let result = await areaModel.updateOne({ _id: idArea }, { $push: tipo })
    return result;
}
public async removeTipo(idArea: string, tipo: any) {
    let result = await areaModel.updateOne({ _id: idArea }, { $pull: tipo })
    return result;
}
  public async updateArea(id: string, Area: any) {
    let result = await areaModel.updateOne({ _id: id }, { $set: Area });
    return result;
  }
  public async deleteArea(id: string) {
    let result = await areaModel.remove({ _id: id });
    return result;
  }
}
export default BussArea;