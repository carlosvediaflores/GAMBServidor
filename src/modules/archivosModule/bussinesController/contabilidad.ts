import contaModel, { IAreaContabilida } from "../models/contabilidad";
class BussConta {
  constructor() {}
  public async readConta(): Promise<Array<IAreaContabilida>>;
  public async readConta(id: string): Promise<IAreaContabilida>;
  public async readConta(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IAreaContabilida>>;

  public async readConta(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IAreaContabilida> | IAreaContabilida> {
    if (params1 && typeof params1 == "string") {
      var result: IAreaContabilida = await contaModel.findOne({ _id: params1 }).populate("idCarpeta");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listConta: Array<IAreaContabilida> = await contaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order).populate("idCarpeta");
      return listConta;
    } else {
      let listContas: Array<IAreaContabilida> = await contaModel.find().populate("idCarpeta");
      return listContas;
    }
  }
  public async total({}) {
    var result = await contaModel.countDocuments();
    return result;
  }
  public async getContaSin(data:any) {
    var result = await contaModel.find(data);
    return result;
  }
  public async searchConta(query?: any): Promise<Array<IAreaContabilida>>;
  public async searchConta(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { numero: { $regex: search, $options: "i" } },
        { detalle: { $regex: search, $options: "i" } },
        { beneficiario: { $regex: search, $options: "i" } },
      ],
    };
    let listConta: Array<IAreaContabilida> = await contaModel.find(filter).sort({ _id: -1 }).populate("idCarpeta")
    return listConta;
  }
  public async addConta(Conta: IAreaContabilida) {
    try {
      let ContaDb = new contaModel(Conta);
      let result = await ContaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePushConta(id: string, Conta: any) {
    let result = await contaModel.updateOne({ _id: id }, { $push: Conta });
    return result;
  }
  public async updateConta(idArchivo: string, Conta: any) {
    console.log(idArchivo, Conta)
    let result = await contaModel.updateOne({ _id: idArchivo }, { $pull: Conta });
    return result;
  }
  public async deleteConta(id: string) {
    let result = await contaModel.deleteOne({ _id: id });
    return result;
  }
  public async readContaFiles(archivo: string): Promise<IAreaContabilida>;
  public async readContaFiles(
    params1?: string | any,
  ): Promise<Array<IAreaContabilida> | IAreaContabilida> {
    if (params1 && typeof params1 == "string") {
      var result: IAreaContabilida = await contaModel.findOne({ archivo: params1 });
      return result;
    }
  }
  public async readContaFile(uri: string) {
    console.log(uri);
    
    let result = await contaModel.findOne({nameFile:uri});
    return result;
  }
  public async queryContaAll(query1?: any, query2?: any,): Promise<Array<IAreaContabilida>>;
  public async queryContaAll(search1: string | any, search2: string | any ) {
    console.log("filer 1 y 2",search1,search2);
    
    let listCarpetas: Array<IAreaContabilida> = await contaModel
      .find(search2)
      .sort({ createdAt: -1 })
      .populate({
        path: "idCarpeta",
        match: search1,          
      })
    //return listCarpetas;
    const filterCarpeta = listCarpetas.filter((carpeta: any) => {
      return carpeta.idCarpeta.length != 0;
    });
    return filterCarpeta;
  }
}
export default BussConta;
