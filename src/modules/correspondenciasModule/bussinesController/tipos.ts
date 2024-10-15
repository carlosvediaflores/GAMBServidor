import tipoModel, { ITipo } from "../models/tipo";
class BussTipo {
  constructor() {}
  public async readTipo(): Promise<Array<ITipo>>;
  public async readTipo(id: string): Promise<ITipo>;
  public async readTipo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ITipo>>;

  public async readTipo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<ITipo> | ITipo> {
    if (params1 && typeof params1 == "string") {
      var result: ITipo = await tipoModel.findOne({ _id: params1 }).populate("idSubTipos");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listArea: Array<ITipo> = await tipoModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idSubTipos");
      return listArea;
    } else {
      let listAreas: Array<ITipo> = await tipoModel.find()
      .populate("idSubTipos");
      return listAreas;
    }
  }
  public async total({}) {
    var result = await tipoModel.countDocuments();
    return result;
  }
  public async searchArea(query?: any): Promise<Array<ITipo>>;
  public async searchArea(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { nombre: { $regex: search, $options: "i" } },
      ],
    };
    let listArea: Array<ITipo> = await tipoModel.find(filter).sort({ _id: -1 });
    return listArea;
  }
  public async addTipo(Area: ITipo) {
    try {
      let AreaDb = new tipoModel(Area);
      let result = await AreaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addIdSubTipo(idTipo: string, tipo: any) {
    let result = await tipoModel.updateOne({ _id: idTipo }, { $push: tipo })
    return result;
}
public async removeTipo(idTipo: string, tipo: any) {
    let result = await tipoModel.updateOne({ _id: idTipo }, { $pull: tipo })
    return result;
}
  public async updateTipo(id: string, Area: any) {
    let result = await tipoModel.updateOne({ _id: id }, { $set: Area });
    return result;
  }
  public async deleteTipo(id: string) {
    let result = await tipoModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussTipo;