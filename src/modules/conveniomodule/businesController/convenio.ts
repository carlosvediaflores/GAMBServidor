import ConvenioModule, { IConvenio } from "../models/convenio";
import EntidadModule, { IEntidad } from "../models/Entidad";

class BussConvenio {
  constructor() {}
  public async readConvenio(): Promise<Array<IConvenio>>;
  public async readConvenio(id: string): Promise<IConvenio>;
  public async readConvenio(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IConvenio>>;

  public async readConvenio(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IConvenio> | IConvenio> {
    if (params1 && typeof params1 == "string") {
      var result: IConvenio = await ConvenioModule.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listConvenio: Array<IConvenio> = await ConvenioModule.find(params1)
        .skip(skip)
        .limit(limit);
      return listConvenio;
    } else {
      let listConvenio: Array<IConvenio> = await ConvenioModule.find()
        .populate({
          path: "entidad",
          model: "cventidades",
          populate: { path: "representante", model: "cvrepresentantes" },
        })
        .populate("entidadejecutora")
        .populate("user");
      return listConvenio;
    }
  }
  public async readUser(post: string): Promise<IConvenio>;
  public async readUser(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IConvenio> | IConvenio> {
    if (params1 && typeof params1 == "string") {
      var result: IConvenio = await ConvenioModule.findOne({ post: params1 });
      return result;
    }
  }
  public async addConvenio(convenio: IConvenio) {
    try {
      let convenioDb = new ConvenioModule(convenio);
      let result = await convenioDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateConvenio(id: string, convenio: any) {
    let result = await ConvenioModule.update({ _id: id }, { $set: convenio });
    return result;
  }
  public async deleteConvenio(id: string) {
    let result = await ConvenioModule.remove({ _id: id });
    return result;
  }
  public async addEntidad(idConve: string, idEnti: any) {
    let convenio = await ConvenioModule.findOne({ _id: idConve });
    if (convenio != null) {
      var enti = await EntidadModule.findOne({ _id: idEnti });
      if (enti != null) {
        var checkrol: Array<IEntidad> = convenio.entidades.filter((item) => {
          if (enti._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        console.log(checkrol);
        if (checkrol.length == 0) {
          convenio.entidades.push(enti);
          return await convenio.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
}
export default BussConvenio;
