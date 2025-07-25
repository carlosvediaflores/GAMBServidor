import gastoFondoModule, { IgastoFondo } from "../models/gastoFondo";
class BussGastoFondo {
  constructor() {}
  public async readGastoFondo(): Promise<Array<IgastoFondo>>;
  public async readGastoFondo(id: string): Promise<IgastoFondo>;
  public async readGastoFondo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IgastoFondo>>;

  public async readGastoFondo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IgastoFondo> | IgastoFondo> {
    if (params1 && typeof params1 == "string") {
      var result: IgastoFondo = await gastoFondoModule.findOne({ _id: params1 }).populate("idPartida");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let gastoFondo: Array<IgastoFondo> = await gastoFondoModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idPartida");
      return gastoFondo;
    } else {
      let gastoFondo: Array<IgastoFondo> = await gastoFondoModule.find().populate("idPartida");
      return gastoFondo;
    }
  }

  public async addGastoFondo(gastoFondo: IgastoFondo) {
    try {
      let gastoFondoDb = new gastoFondoModule(gastoFondo);
      let result = await gastoFondoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateGastoFondo(id: string, tipoDes: any) {
    let result = await gastoFondoModule.updateOne({ _id: id }, { $set: tipoDes });
    return result;
  }
  public async deleteGastoFondo(id: string) {
    let result = await gastoFondoModule.deleteOne({ _id: id });
    return result;
  }
}
export default BussGastoFondo ;
