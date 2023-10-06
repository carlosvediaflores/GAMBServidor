import documentoModel, { IDocumento } from "../models/documentos";

class BussDocument {
  constructor() {}

  //Listar Buscar Filtrar
  public async readDocument(): Promise<Array<IDocumento>>;
  public async readDocument(id: string): Promise<IDocumento>;
  public async readDocument(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IDocumento>>;

  public async readDocument(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IDocumento> | IDocumento> {
    if (params1 && typeof params1 == "string") {
      var result: IDocumento = (
        await documentoModel.findOne({ _id: params1 })
      ).populate({
        path: "modelo_tipo",
        model: "model_tipos",
        populate: {
          path: "documentos",
          model: "model_documents",
        },
      })
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listDocument: Array<IDocumento> = await documentoModel
        .find(params1)
        .populate("modelo_tipo")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listDocument;
    } else {
      let listDocuments: Array<IDocumento> = await documentoModel
        .find()
        .populate("modelo_tipo");
      return listDocuments;
    }
  }

  //Crear
  public async addDocument(Document: IDocumento) {
    try {
      let DocumentDb = new documentoModel(Document);
      let result = await DocumentDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateDocument(id: string, Document: any) {
    let result = await documentoModel.updateOne(
      { _id: id },
      { $set: Document }
    );
    return result;
  }
  //Ver Archivo
  public async readDocumentFile(uri: string) {
    let result = await documentoModel.findOne({nameFile:uri});
    return result;
  }
  //eliminar
  public async deleteDocument(id: string) {
    let result = await documentoModel.deleteOne({ _id: id });
    return result;
  }
  
}

export default BussDocument;
