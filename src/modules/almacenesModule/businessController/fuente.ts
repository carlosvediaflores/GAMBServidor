import fuenteModule, { Ifuente} from "../models/fuente";
class BussFuente {
  constructor() {}
  public async readFuente(): Promise<Array<Ifuente>>;
  public async readFuente(id: string): Promise<Ifuente>;
  public async readFuente(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<Ifuente>>;

  public async readFuente(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<Ifuente> | Ifuente> {
    if (params1 && typeof params1 == "string") {
      var result: Ifuente = await fuenteModule.findOne({ _id: params1 }).populate("idff idof");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let fuente: Array<Ifuente> = await fuenteModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idff idof");
      return fuente;
    } else {
      let fuente: Array<Ifuente> = await fuenteModule.find().populate("idff idof");
      return fuente;
    }
  }

  public async addFuente(fuente: Ifuente) {
    try {
      let fuenteDb = new fuenteModule(fuente);
      let result = await fuenteDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateFuente(id: string, fuente: any) {
    let result = await fuenteModule.updateOne({ _id: id }, { $set: fuente });
    return result;
  }
  public async deleteFuente(id: string) {
    let result = await fuenteModule.deleteOne({ _id: id });
    return result;
  }
}
export default BussFuente ;
