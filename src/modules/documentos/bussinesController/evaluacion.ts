import evaluacionModel, { IEvaluacion } from "../models/evaluacion";

class BussEvaluacion {
  constructor() {}

  //Listar Buscar Filtrar
  public async readEvaluacion(): Promise<Array<IEvaluacion>>;
  public async readEvaluacion(id: string): Promise<IEvaluacion>;
  public async readEvaluacion(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IEvaluacion>>;

  public async readEvaluacion(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IEvaluacion> | IEvaluacion> {
    if (params1 && typeof params1 == "string") {
      var result: IEvaluacion = (await evaluacionModel.findOne({ _id: params1 }))
        .populate("archivos")
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEvaluacion: Array<IEvaluacion> = await evaluacionModel
        .find(params1)
        .populate("archivos")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listEvaluacion;
    } else {
      let listEvaluacions: Array<IEvaluacion> = await evaluacionModel
        .find()
        .populate("archivos")
      return listEvaluacions;
    }
  }
  //Crear
  public async addEvaluacion(Evaluacion: IEvaluacion) {
    try {
      let EvaluacionDb = new evaluacionModel(Evaluacion);
      let result = await EvaluacionDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateEvaluacion(id: string, Evaluacion: any) {
    let result = await evaluacionModel.updateOne({ _id: id }, { $set: Evaluacion });
    return result;
  }
  //eliminar
  public async deleteEvaluacion(id: string) {
    let result = await evaluacionModel.deleteOne({ _id: id });
    return result;
  }
  //Agregar idArchivo a Evaluacion
  public async updatePushEvaluacion(idEval: string, idArchivo: any) {
    let result = await evaluacionModel.updateOne(
      { _id: idEval },
      { $push: { archivos: idArchivo } }
    );
    return result;
  }
  //Remover IdArchivo de Evaluacion
  public async removeEvaluacionId(idEval: string, idArchivo: any) {
    let result = await evaluacionModel.updateOne(
      { _id: idEval },
      { $pull: { archivos: idArchivo } }
    );
    return result;
  }
}

export default BussEvaluacion;
