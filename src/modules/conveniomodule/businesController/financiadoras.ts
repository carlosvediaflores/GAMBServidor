import FinanModule, {IFinaciadoras} from "../models/finaciadoras"
class BussFinanc{
    constructor() {}
    public async readFinanc(): Promise<Array<IFinaciadoras>>;
    public async readFinanc(id: string): Promise<IFinaciadoras>;
    public async readFinanc(
      query: any,
      skip: number,
      limit: number,
      order: any
    ): Promise<Array<IFinaciadoras>>;
  
    public async readFinanc(
      params1?: string | any,
      params2?: number,
      params3?: number,
      order?: any
    ): Promise<Array<IFinaciadoras> | IFinaciadoras> {
      if (params1 && typeof params1 == "string") {
        var result: IFinaciadoras = await FinanModule.findOne({
          _id: params1,
        }).populate("transferencia");
        return result;
      } else if (params1) {
        let skip = params2;
        let limit = params3;
        let listConvenio: Array<IFinaciadoras> = await FinanModule.find(params1)
          .skip(skip)
          .limit(limit)
          .sort(order)
          .populate({
            path: "entidad",
            model: "cventidades",
            populate: { path: "representante", model: "cvrepresentantes" },
          })
          .populate("entidadejecutora")
          .populate("user")
          .populate("files")
          .populate("transferencia");
        return listConvenio;
      } else {
        let listFinanc: Array<IFinaciadoras> = await FinanModule.find()
          .populate({
            path: "entidad",
            model: "cventidades",
            populate: { path: "representante", model: "cvrepresentantes" },
          })
          .populate("entidadejecutora")
          .populate("user")
          .populate("files")
          .populate("transferencia");
        return listFinanc;
      }
    }
    public async addFinanc(financ: IFinaciadoras) {
      try {
        let finanDb = new FinanModule(financ);
        let result = await finanDb.save();
        return result;
      } catch (err) {
        return err;
      }
    }
    public async updateFinanc(id: string, financ: any) {
      let result = await FinanModule.updateOne({ _id: id }, { $set: financ });
      return result;
    }
    public async deleteFinanc(id: string) {
      let result = await FinanModule.remove({ _id: id });
      return result;
    }
    
  }
  export default BussFinanc;