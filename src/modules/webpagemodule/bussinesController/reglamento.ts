import reglamentoModule, { IReglamento } from "../models/reglamento";

class BussReglamento {
  constructor() {}
  public async readReglamento(): Promise<Array<IReglamento>>;
  public async readReglamento(id: string): Promise<IReglamento>;
  public async readReglamento(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IReglamento>>;

  public async readReglamento(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IReglamento> | IReglamento> {
    if (params1 && typeof params1 == "string") {
      var result: IReglamento = await reglamentoModule
        .findOne({ _id: params1 })
        .populate("usuario");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listReglamento: Array<IReglamento> = await reglamentoModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario");
      return listReglamento;
    } else {
      let listReglamento: Array<IReglamento> = await reglamentoModule
        .find()
        .populate("usuario");
      return listReglamento;
    }
  }
  public async total({}) {
    var result = await reglamentoModule.countDocuments();
    return result;
  }
  public async readReglamentoFile(archivo: string): Promise<IReglamento>;
  public async readReglamentoFile(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IReglamento> | IReglamento> {
    if (params1 && typeof params1 == "string") {
      var result: IReglamento = await reglamentoModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async search(query?: any): Promise<Array<IReglamento>>;
  public async search(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
        publico: true ,
      $or: [
        { titulo: { $regex: search, $options: "i" } }
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listReglamento: Array<IReglamento> = await reglamentoModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("usuario");
    return listReglamento;
  }
  public async addReglamento(Reglamento: IReglamento) {
    try {
      let ReglamentoDb = new reglamentoModule(Reglamento);
      let result = await ReglamentoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateReglamento(id: string, Reglamento: any) {
    let result = await reglamentoModule.updateOne({ _id: id }, { $set: Reglamento });
    return result;
  }
  public async deleteReglamento(id: string) {
    let result = await reglamentoModule.deleteOne({ _id: id });
    return result;
  }
}
export default BussReglamento;
