import dependenciaModel, { IDependemcias } from "../models/dependencias";
class BussDependencia {
  constructor() {}
  public async readDependencias(): Promise<Array<IDependemcias>>;
  public async readDependencias(id: string): Promise<IDependemcias>;
  public async readDependencias(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IDependemcias>>;

  public async readDependencias(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IDependemcias> | IDependemcias> {
    if (params1 && typeof params1 == "string") {
      var result: IDependemcias = await dependenciaModel.findOne({ _id: params1 }).populate("idDependencia");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listConta: Array<IDependemcias> = await dependenciaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idDependencia");
      return listConta;
    } else {
      let listContas: Array<IDependemcias> = await dependenciaModel.find().populate("idDependencia");
      return listContas;
    }
  }
  public async total({}) {
    var result = await dependenciaModel.countDocuments();
    return result;
  }
  public async getContaSin(data:any) {
    var result = await dependenciaModel.find(data);
    return result;
  }
  public async searchConta(query?: any): Promise<Array<IDependemcias>>;
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
    let listConta: Array<IDependemcias> = await dependenciaModel.find(filter).sort({ _id: -1 }).populate("idCarpeta")
    return listConta;
  }
  public async addDependencia(Conta: IDependemcias) {
    try {
      let ContaDb = new dependenciaModel(Conta);
      let result = await ContaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async  updatePushConta(id: string, Conta: any) {
    let result = await dependenciaModel.updateOne({ _id: id }, { $push: Conta });
    return result;
  }
  public async updateContaId(idArchivo: string, Conta: any) {
    let result = await dependenciaModel.updateOne({ _id: idArchivo }, { $pull: Conta });
    return result;
  }
  //Editar
  public async updateDependencia(id: string, Document: any) {
    let result = await dependenciaModel.updateOne(
      { _id: id },
      { $set: Document }
    );
    return result;
  }
  public async deleteDependencia(id: string) {
    let result = await dependenciaModel.deleteOne({ _id: id });
    return result;
  }
  public async readContaFiles(archivo: string): Promise<IDependemcias>;
  public async readContaFiles(
    params1?: string | any,
  ): Promise<Array<IDependemcias> | IDependemcias> {
    if (params1 && typeof params1 == "string") {
      var result: IDependemcias = await dependenciaModel.findOne({ archivo: params1 });
      return result;
    }
  }
  public async getFile(file: string) {   
    let result = await dependenciaModel.findOne({fileName:file});
    return result;
  }
  public async queryContaAll(query1?: any, query2?: any,): Promise<Array<IDependemcias>>;
  public async queryContaAll(search1: string | any, search2: string | any ) {   
    let listCarpetas: Array<IDependemcias> = await dependenciaModel
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
export default BussDependencia;
