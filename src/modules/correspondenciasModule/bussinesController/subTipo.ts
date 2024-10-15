import subTipoModel, { ISubTipo } from "../models/subTipo";
class BussSubTipo {
  constructor() {}
  public async readSubTipo(): Promise<Array<ISubTipo>>;
  public async readSubTipo(id: string): Promise<ISubTipo>;
  public async readSubTipo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ISubTipo>>;

  public async readSubTipo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<ISubTipo> | ISubTipo> {
    if (params1 && typeof params1 == "string") {
      var result: ISubTipo = await subTipoModel.findOne({ _id: params1 }).populate("idTipo");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listArea: Array<ISubTipo> = await subTipoModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idTipo");
      return listArea;
    } else {
      let listAreas: Array<ISubTipo> = await subTipoModel.find().populate("idTipo");
      return listAreas;
    }
  }
  public async total({}) {
    var result = await subTipoModel.countDocuments();
    return result;
  }
  public async searchArea(query?: any): Promise<Array<ISubTipo>>;
  public async searchArea(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { nombre: { $regex: search, $options: "i" } },
      ],
    };
    let listArea: Array<ISubTipo> = await subTipoModel.find(filter).sort({ _id: -1 });
    return listArea;
  }
  public async addSubTipo(Area: ISubTipo) {
    try {
      let AreaDb = new subTipoModel(Area);
      let result = await AreaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addTipo(idArea: string, tipo: any) {
    let result = await subTipoModel.updateOne({ _id: idArea }, { $push: tipo })
    return result;
}
public async removeTipo(idArea: string, tipo: any) {
    let result = await subTipoModel.updateOne({ _id: idArea }, { $pull: tipo })
    return result;
}
  public async updateSubTipo(id: string, Area: any) {
    let result = await subTipoModel.updateOne({ _id: id }, { $set: Area });
    return result;
  }
  public async deleteSubTipo(id: string) {
    let result = await subTipoModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussSubTipo;