import FileEvaluacionModel, { IFileEvaluacion } from "../models/fileEvaluacion";

class BussEvaluacionFile {
  constructor() {}

  //Listar Buscar Filtrar
  public async readEvaluacionFile(): Promise<Array<IFileEvaluacion>>;
  public async readEvaluacionFile(id: string): Promise<IFileEvaluacion>;
  public async readEvaluacionFile(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IFileEvaluacion>>;

  public async readEvaluacionFile(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IFileEvaluacion> | IFileEvaluacion> {
    if (params1 && typeof params1 == "string") {
      var result: IFileEvaluacion = (await FileEvaluacionModel.findOne({ _id: params1 }))
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEvaluacion: Array<IFileEvaluacion> = await FileEvaluacionModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listEvaluacion;
    } else {
      let listEjecucions: Array<IFileEvaluacion> = await FileEvaluacionModel
        .find()
      return listEjecucions;
    }
  }

  //Crear
  public async addEvaluacionFile(Evaluacion: IFileEvaluacion) {
    try {
      let EvaluacionFileDb = new FileEvaluacionModel(Evaluacion);
      let result = await EvaluacionFileDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Ver Archivo
  public async readEvaluacionFil(uri: string) {
    let result = await FileEvaluacionModel.findOne({ nameFile: uri });
    return result;
  }

  //eliminar
  public async deleteEvaluacionFile(id: string) {
    let result = await FileEvaluacionModel.deleteOne({ _id: id });
    return result;
  }
}

export default BussEvaluacionFile;
