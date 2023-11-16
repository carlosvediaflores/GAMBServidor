import modelTipoNormativa, { ITipoNormativa } from "../models/tipoNormativa";

class BussTipoNormativa {
  constructor() {}

  //Listar Filtrar
  public async readTipoNormativa(): Promise<Array<ITipoNormativa>>;
  public async readTipoNormativa(id: string): Promise<ITipoNormativa>;
  public async readTipoNormativa(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ITipoNormativa>>;

  public async readTipoNormativa(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ITipoNormativa> | ITipoNormativa> {
    if (params1 && typeof params1 == "string") {
      var result: ITipoNormativa = (
        await modelTipoNormativa.findOne({ _id: params1 })
      ).populate({
        path: "normativa",
        model: "doc_normativas",
        options: { sort: { _id: -1 } },
      });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listTipoNormativa: Array<ITipoNormativa> = await modelTipoNormativa
        .find(params1)
        .populate({
          path: "normativa",
          model: "doc_normativas",
          options: { sort: { _id: 1 } },
        })
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listTipoNormativa;
    } else {
      let listTipoNormativas: Array<ITipoNormativa> = await modelTipoNormativa
        .find()
        .populate({
          path: "normativa",
          model: "doc_normativas",
          options: { sort: { fechaFin: 1, numero:1 } },
        });
      return listTipoNormativas;
    }
  }
  //Crear TipoNormativa
  public async addTipoNormativa(TipoNormativa: ITipoNormativa) {
    try {
      let TipoNormativaDb = new modelTipoNormativa(TipoNormativa);
      let result = await TipoNormativaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateTipoNormativa(id: string, Document: any) {
    let result = await modelTipoNormativa.updateOne(
      { _id: id },
      { $set: Document }
    );
    return result;
  }
  //eliminar
  public async deleteTipoNormativa(id: string) {
    let result = await modelTipoNormativa.deleteOne({ _id: id });
    return result;
  }
  //Agregar idNormativa a TipoNormativa
  public async updatePushNormativa(idTipo: string, idNorma: any) {
    let result = await modelTipoNormativa.updateOne(
      { _id: idTipo },
      { $push: { normativa: idNorma } }
    );
    return result;
  }
  //Remover IdNormativa de TipoNormativa
  public async removeNormativaId(idTipo: string, idNorma: any) {
    let result = await modelTipoNormativa.updateOne(
      { _id: idTipo },
      { $pull: { normativa: idNorma } }
    );
    return result;
  }
}
export default BussTipoNormativa;
