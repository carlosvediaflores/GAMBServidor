import segControlModel, { IsegControl } from "../models/seguimientoControl";

class BussSegControl {
  constructor() {}

  //Listar Buscar Filtrar
  public async readSegControl(): Promise<Array<IsegControl>>;
  public async readSegControl(id: string): Promise<IsegControl>;
  public async readSegControl(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IsegControl>>;

  public async readSegControl(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IsegControl> | IsegControl> {
    if (params1 && typeof params1 == "string") {
      var result: IsegControl = (
        await segControlModel.findOne({ _id: params1 })
      )
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listDocument: Array<IsegControl> = await segControlModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listDocument;
    } else {
      let listDocuments: Array<IsegControl> = await segControlModel
        .find()
      return listDocuments;
    }
  }

  //Crear
  public async addSegControl(SegControl: IsegControl) {
    try {
      let DocumentDb = new segControlModel(SegControl);
      let result = await DocumentDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateDocument(id: string, Document: any) {
    let result = await segControlModel.updateOne(
      { _id: id },
      { $set: Document }
    );
    return result;
  }
  //Ver Archivo
  public async readDocumentFile(uri: string) {
    let result = await segControlModel.findOne({nameFile:uri});
    return result;
  }
  //eliminar
  public async deleteDocument(id: string) {
    let result = await segControlModel.deleteOne({ _id: id });
    return result;
  }
  
}

export default BussSegControl;
