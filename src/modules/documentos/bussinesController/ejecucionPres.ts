import ejecucionModel, { IEjecucion } from "../models/ejecucionPres";

class BussEjecucion {
  constructor() {}

  //Listar Buscar Filtrar
  public async readEjecucion(): Promise<Array<IEjecucion>>;
  public async readEjecucion(id: string): Promise<IEjecucion>;
  public async readEjecucion(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IEjecucion>>;

  public async readEjecucion(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IEjecucion> | IEjecucion> {
    if (params1 && typeof params1 == "string") {
      var result: IEjecucion = (await ejecucionModel.findOne({ _id: params1 }))
        .populate("archivos")
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEjecucion: Array<IEjecucion> = await ejecucionModel
        .find(params1)
        .populate("archivos")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listEjecucion;
    } else {
      let listEjecucions: Array<IEjecucion> = await ejecucionModel
        .find()
        .populate("archivos")
      return listEjecucions;
    }
  }
  //Crear
  public async addEjecucion(Ejecucion: IEjecucion) {
    try {
      let EjecucionDb = new ejecucionModel(Ejecucion);
      let result = await EjecucionDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateEjecucion(id: string, Ejecucion: any) {
    let result = await ejecucionModel.updateOne({ _id: id }, { $set: Ejecucion });
    return result;
  }
  //eliminar
  public async deleteEjecucion(id: string) {
    let result = await ejecucionModel.deleteOne({ _id: id });
    return result;
  }
  //Agregar idArchivo a Ejecucion
  public async updatePushEjecucion(idPrest: string, idArchivo: any) {
    let result = await ejecucionModel.updateOne(
      { _id: idPrest },
      { $push: { archivos: idArchivo } }
    );
    return result;
  }
  //Remover IdArchivo de Ejecucion
  public async removeEjecucionId(idPrest: string, idArchivo: any) {
    let result = await ejecucionModel.updateOne(
      { _id: idPrest },
      { $pull: { archivos: idArchivo } }
    );
    return result;
  }
}

export default BussEjecucion;
