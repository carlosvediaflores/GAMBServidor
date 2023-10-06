import modelModelo, { IModelo } from "../models/modelos";

class BussModelo {
    constructor() {}

    //Listar Filtrar
    public async readModelo(): Promise<Array<IModelo>>;
    public async readModelo(id: string): Promise<IModelo>;
    public async readModelo(
      query: any,
      skip: number,
      limit: number,
      order: any
    ): Promise<Array<IModelo>>;
  
    public async readModelo(
      params1?: string | any,
      params2?: number,
      params3?: number,
      order?:any
    ): Promise<Array<IModelo> | IModelo> {
      if (params1 && typeof params1 == "string") {
        var result: IModelo = (await modelModelo.findOne({ _id: params1 })).populate("documentos");
        return result;
      } else if (params1) {
        let skip = params2;
        let limit = params3;
        let listModelo: Array<IModelo> = await modelModelo
          .find(params1)
          .populate("documentos")
          .skip(skip)
          .limit(limit)
          .sort(order);
        return listModelo;
      } else {
        let listModelos: Array<IModelo> = await modelModelo.find().populate("documentos");
        return listModelos;
      }
    }
    //Crear modelo
  public async addModelo(Modelo: IModelo) {
    try {
      let ModeloDb = new modelModelo(Modelo);
      let result = await ModeloDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
   //Editar
   public async updateModelo(id: string, Document: any) {
    let result = await modelModelo.updateOne(
      { _id: id },
      { $set: Document }
    );
    return result;
  }
  //eliminar
  public async deleteModelo(id: string) {
    let result = await modelModelo.deleteOne({ _id: id });
    return result;
  }
  //Agregar idDocumento a Modelo
  public async updatePushDoc(idModel: string, idDoc: any) {
    let result = await modelModelo.updateOne({ _id: idModel }, { $push: {documentos:idDoc  } });
    return result;
  }
  //Remover IdDocumento de Modelo
  public async removeDocId(idModel: string, idDoc: any) {
    let result = await modelModelo.updateOne(
      { _id: idModel },
      { $pull: { documentos: idDoc } }
    );
    return result;
  }
}
export default BussModelo;
