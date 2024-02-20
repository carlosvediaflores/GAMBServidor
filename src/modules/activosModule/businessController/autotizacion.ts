import autorizacionModel, { IAutorizacion } from "../models/autorizacion";
class BussAutorization {
  constructor() {}
  public async readAutorization(): Promise<Array<IAutorizacion>>;
  public async readAutorization(id: string): Promise<IAutorizacion>;
  public async readAutorization(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IAutorizacion>>;

  public async readAutorization(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IAutorizacion> | IAutorizacion> {
    if (params1 && typeof params1 == "string") {
      var result: IAutorizacion = await autorizacionModel.findOne({ _id: params1 }).populate("id_programa");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listAutorization: Array<IAutorizacion> = await autorizacionModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("id_programa");
      return listAutorization;
    } else {
      let listAutorization: Array<IAutorizacion> = await autorizacionModel.find().populate("id_programa");
      return listAutorization;
    }
  }
  public async searchAutorization(query?: any): Promise<Array<IAutorizacion>>;
  public async searchAutorization(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listAutorization: Array<IAutorizacion> = await autorizacionModel.find(filter).sort({ _id: -1 })
    return listAutorization;
  }
  public async readAutorizationCod(codigo: string | any): Promise<IAutorizacion>;
  public async readAutorizationCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IAutorizacion> | IAutorizacion> {
    if (params1 && typeof params1 == "string") {
      var result: IAutorizacion = await autorizacionModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addAutorization(Autorization: any) {
    try {
      let AutorizationDb = new autorizacionModel(Autorization);
      let result = await AutorizationDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async getNumAut() {
    var result = await autorizacionModel
      .findOne()
      .limit(1)
      .sort({ _id: -1 });
    return result;
  }
  public async updateAutorization(id: string, Autorization: any) {
    let result = await autorizacionModel.updateOne({ _id: id }, { $set: Autorization });
    return result;
  }
  public async deleteAutorization(id: string) {
    let result = await autorizacionModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussAutorization;
