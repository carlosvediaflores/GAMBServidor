import medidaModule, { IMedida } from "../models/medidas";

class BusMedida {
  constructor() {}
  public async readMedida(): Promise<Array<IMedida>>;
  public async readMedida(id: string): Promise<IMedida>;
  public async readMedida(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IMedida>>;

  public async readMedida(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IMedida> | IMedida> {
    if (params1 && typeof params1 == "string") {
      var result: IMedida = await medidaModule
        .findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listMedida: Array<IMedida> = await medidaModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listMedida;
    } else {
      let listMedida: Array<IMedida> = await medidaModule
        .find();
      return listMedida;
    }
  }
  public async total({}) {
    var result = await medidaModule.countDocuments();
    return result;
  }
  public async searchMedida(query?: any): Promise<Array<IMedida>>;
  public async searchMedida(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { unidadMedida: { $regex: search, $options: "i" } },
        { simbolo: { $regex: search, $options: "i" } },
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listMedida: Array<IMedida> = await medidaModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    return listMedida;
  }
  public async addMedida(Medida: IMedida) {
    try {
      let MedidaDb = new medidaModule(Medida);
      let result = await MedidaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateMedida(id: string, Medida: any) {
    let result = await medidaModule.updateOne({ _id: id }, { $set: Medida });
    return result;
  }
  public async deleteMedida(id: string) {
    let result = await medidaModule.deleteOne({ _id: id });
    return result;
  }
}
export default BusMedida;
