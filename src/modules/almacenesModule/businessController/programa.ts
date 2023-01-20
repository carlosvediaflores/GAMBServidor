import programaModel, { IPrograma } from "../models/programa";
class BussPrograma {
  constructor() {}
  public async readPrograma(): Promise<Array<IPrograma>>;
  public async readPrograma(id: string): Promise<IPrograma>;
  public async readPrograma(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPrograma>>;

  public async readPrograma(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IPrograma> | IPrograma> {
    if (params1 && typeof params1 == "string") {
      var result: IPrograma = await programaModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPrograma: Array<IPrograma> = await programaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listPrograma;
    } else {
      let listPrograma: Array<IPrograma> = await programaModel.find();
      return listPrograma;
    }
  }
  public async searchProg(query?: any): Promise<Array<IPrograma>>;
  public async searchProg(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listPrograma: Array<IPrograma> = await programaModel.find(filter).sort({ _id: -1 })
    return listPrograma;
  }
  public async readProgramaCod(codigo: string | any): Promise<IPrograma>;
  public async readProgramaCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IPrograma> | IPrograma> {
    if (params1 && typeof params1 == "string") {
      var result: IPrograma = await programaModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addPrograma(Programa: IPrograma) {
    try {
      let programaDb = new programaModel(Programa);
      let result = await programaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePrograma(id: string, programa: any) {
    let result = await programaModel.update({ _id: id }, { $set: programa });
    return result;
  }
  public async deletePrograma(id: string) {
    let result = await programaModel.remove({ _id: id });
    return result;
  }
}
export default BussPrograma;
