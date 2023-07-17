import carpetaModel, { ICarpeta } from "../models/carpeta";
class BussCarpeta {
  constructor() {}
  public async readCarpeta(): Promise<Array<ICarpeta>>;
  public async readCarpeta(id: string): Promise<ICarpeta>;
  public async readCarpeta(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ICarpeta>>;

  public async readCarpeta(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<ICarpeta> | ICarpeta> {
    if (params1 && typeof params1 == "string") {
      var result: ICarpeta = await carpetaModel.findOne({ _id: params1 }).populate("areaContabilidad");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listCarpeta: Array<ICarpeta> = await carpetaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order).populate("areaContabilidad");
      return listCarpeta;
    } else {
      let listCarpetas: Array<ICarpeta> = await carpetaModel.find().populate("areaContabilidad");
      return listCarpetas;
    }
  }
  public async total({}) {
    var result = await carpetaModel.countDocuments();
    return result;
  }
  public async readCarpetaFile(archivo: string): Promise<ICarpeta>;
  public async readCarpetaFile(
    params1?: string | any,
  ): Promise<Array<ICarpeta> | ICarpeta> {
    if (params1 && typeof params1 == "string") {
      var result: ICarpeta = await carpetaModel.findOne({ archivo: params1 });
      return result;
    }
  }
  public async searchCarpeta(query?: any): Promise<Array<ICarpeta>>;
  public async searchCarpeta(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { objetivo: { $regex: search, $options: "i" } },
        { tomo: { $regex: search, $options: "i" } },
        { tipo: { $regex: search, $options: "i" } },
        { lugar: { $regex: search, $options: "i" } },
        { ubicacion: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
      ],
    };
    let listCarpeta: Array<ICarpeta> = await carpetaModel.find(filter).sort({ _id: -1 }).populate("areaContabilidad")
    return listCarpeta;
  }
  public async addCarpeta(Carpeta: ICarpeta) {
    try {
      let CarpetaDb = new carpetaModel(Carpeta);
      let result = await CarpetaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addContaId(idCarpeta: string, idArea: any) {
    let result = await carpetaModel.updateOne({ _id: idCarpeta }, { $push: {areaContabilidad:idArea }})
    return result;
}
/* public async removeSub(idOr: string, organizacion: any) {
    let result = await OrganizacionModel.updateOne({ _id: idOr }, { $pull: organizacion })
    return result;
} */
  public async updateCarpeta(id: string, Carpeta: any) {
    let result = await carpetaModel.updateOne({ _id: id }, { $set: Carpeta });
    return result;
  }
  public async deleteCarpeta(id: string) {
    let result = await carpetaModel.remove({ _id: id });
    return result;
  }
}
export default BussCarpeta;
