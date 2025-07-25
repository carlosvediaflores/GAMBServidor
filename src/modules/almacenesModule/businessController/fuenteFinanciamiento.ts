import fuenteFinanciamientoModule, { IfuenteFinanciamiento} from "../models/fuenteFinanciamiento";
class BussFuenteFinanciamiento {
  constructor() {}
  public async readFuenteFinanc(): Promise<Array<IfuenteFinanciamiento>>;
  public async readFuenteFinanc(id: string): Promise<IfuenteFinanciamiento>;
  public async readFuenteFinanc(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IfuenteFinanciamiento>>;

  public async readFuenteFinanc(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IfuenteFinanciamiento> | IfuenteFinanciamiento> {
    if (params1 && typeof params1 == "string") {
      var result: IfuenteFinanciamiento = await fuenteFinanciamientoModule.findOne({ _id: params1 }).populate("id_programa");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let fuenteFinanc: Array<IfuenteFinanciamiento> = await fuenteFinanciamientoModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("id_programa");
      return fuenteFinanc;
    } else {
      let fuenteFinanc: Array<IfuenteFinanciamiento> = await fuenteFinanciamientoModule.find().populate("id_programa");
      return fuenteFinanc;
    }
  }

  public async addFuenteFinanc(fuente: IfuenteFinanciamiento) {
    try {
      let fuenteFinancDb = new fuenteFinanciamientoModule(fuente);
      let result = await fuenteFinancDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }

}
export default BussFuenteFinanciamiento ;
