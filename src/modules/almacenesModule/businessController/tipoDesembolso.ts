import tipoDesemdModel, { ItipoDesem } from "../models/tipoDesembolso";
class BussTipoDesembols {
  constructor() {}
  public async readTipoDesem(): Promise<Array<ItipoDesem>>;
  public async readTipoDesem(id: string): Promise<ItipoDesem>;
  public async readTipoDesem(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ItipoDesem>>;

  public async readTipoDesem(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ItipoDesem> | ItipoDesem> {
    if (params1 && typeof params1 == "string") {
      var result: ItipoDesem = await tipoDesemdModel
        .findOne({ _id: params1 })
        .populate({
          path: "desembolsos",
          model: "alm_desembolso",
          populate: { path: "idFuentes", model: "alm_desemFuente" },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let tipoDesem: Array<ItipoDesem> = await tipoDesemdModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate({
          path: "desembolsos",
          model: "alm_desembolso",
          populate: { path: "idFuentes", model: "alm_desemFuente" },
        });
      return tipoDesem;
    } else {
      let tipoDesem: Array<ItipoDesem> = await tipoDesemdModel.find().populate({
        path: "desembolsos",
        model: "alm_desembolso",
        populate: { path: "idFuentes", model: "alm_desemFuente" },
      });
      return tipoDesem;
    }
  }

  public async addTipoDesem(TipoDesem: ItipoDesem) {
    try {
      let TipoDesemDb = new tipoDesemdModel(TipoDesem);
      let result = await TipoDesemDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  // public async updateTipoDesem(id: string, tipoDes: any) {
  //   let result = await tipoDesemdModel.updateOne(
  //     { _id: id },
  //     { $set: tipoDes }
  //   );
  //   return result;
  // }

  public async updateTipoDesem(
    id: string,
    data: any,
    options: { inc?: boolean; push?: boolean } = {}
  ) {
    if (options.inc) {
      // Incremento atómico para campos numéricos
      return await tipoDesemdModel.findOneAndUpdate(
        { _id: id },
        { $inc: data },
        { new: true }
      );
    } else if (options.push) {
      // Agregar elementos a arrays
      return await tipoDesemdModel.findOneAndUpdate(
        { _id: id },
        { $push: data },
        { new: true }
      );
    } else {
      // Actualización normal
      return await tipoDesemdModel.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true }
      );
    }
  }
  public async deleteTipoDesem(id: string) {
    let result = await tipoDesemdModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussTipoDesembols;
