import organismoFinanciadorModule, { IorganismoFinanciador} from "../models/organismoFinanciador";
class BussOrganismoFinanciador {
  constructor() {}
  public async readOrgFinanc(): Promise<Array<IorganismoFinanciador>>;
  public async readOrgFinanc(id: string): Promise<IorganismoFinanciador>;
  public async readOrgFinanc(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IorganismoFinanciador>>;

  public async readOrgFinanc(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IorganismoFinanciador> | IorganismoFinanciador> {
    if (params1 && typeof params1 == "string") {
      var result: IorganismoFinanciador = await organismoFinanciadorModule.findOne({ _id: params1 }).populate("id_programa");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let OrgFinanc: Array<IorganismoFinanciador> = await organismoFinanciadorModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("id_programa");
      return OrgFinanc;
    } else {
      let OrgFinanc: Array<IorganismoFinanciador> = await organismoFinanciadorModule.find().populate("id_programa");
      return OrgFinanc;
    }
  }

  public async addOrgFinanc(OrgFinanc: IorganismoFinanciador) {
    try {
      let OrgFinancDb = new organismoFinanciadorModule(OrgFinanc);
      let result = await OrgFinancDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }

}
export default BussOrganismoFinanciador;
