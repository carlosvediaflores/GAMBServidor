import ejecucionFileModel, { IEjecucionFile } from "../models/ejecucionFile";

class BussEjecucionFile {
  constructor() {}

  //Listar Buscar Filtrar
  public async readEjecucionFile(): Promise<Array<IEjecucionFile>>;
  public async readEjecucionFile(id: string): Promise<IEjecucionFile>;
  public async readEjecucionFile(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IEjecucionFile>>;

  public async readEjecucionFile(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IEjecucionFile> | IEjecucionFile> {
    if (params1 && typeof params1 == "string") {
      var result: IEjecucionFile = (await ejecucionFileModel.findOne({ _id: params1 }))
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listEjecucion: Array<IEjecucionFile> = await ejecucionFileModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listEjecucion;
    } else {
      let listEjecucions: Array<IEjecucionFile> = await ejecucionFileModel
        .find()
      return listEjecucions;
    }
  }

  //Crear
  public async addEjecucionFile(Ejecucion: IEjecucionFile) {
    try {
      let EjecucionFileDb = new ejecucionFileModel(Ejecucion);
      let result = await EjecucionFileDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Ver Archivo
  public async readEjecucionFil(uri: string) {
    let result = await ejecucionFileModel.findOne({ nameFile: uri });
    return result;
  }

  //eliminar
  public async deleteEjecucionFile(id: string) {
    let result = await ejecucionFileModel.deleteOne({ _id: id });
    return result;
  }
}

export default BussEjecucionFile;
