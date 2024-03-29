import ConvenioModule, { IConvenio } from "../models/convenio";
import EntidadModule, { IEntidad } from "../models/Entidad";
import filesModule, { IFilescv } from "../models/files";
import financModule, {IFinaciadoras} from "../models/finaciadoras"
import transfeModel, { ITransferencia } from "../models/transferencia";

class BussConvenio {
  constructor() {}
  public async readConvenio(): Promise<Array<IConvenio>>;
  public async readConvenio(id: string): Promise<IConvenio>;
  public async readConvenio(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IConvenio>>;

  public async readConvenio(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IConvenio> | IConvenio> {
    if (params1 && typeof params1 == "string") {
      var result: IConvenio = await ConvenioModule.findOne({
        _id: params1,
      })
      .populate("transferencia")
      .populate({
        path: "financiadoras",
        model: "cvfinanciadoras",
        populate: { path: "entidad", model: "cventidades" },
      });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listConvenio: Array<IConvenio> = await ConvenioModule.find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate({
          path: "financiadoras",
          model: "cvfinanciadoras",
          populate: { path: "entidad", model: "cventidades" },
        })
        .populate("transferencia")
        .populate("entidadejecutora")
        .populate("user")
        .populate("files")
      return listConvenio;
    } else {
      let listConvenio: Array<IConvenio> = await ConvenioModule.find()
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
    }
  }
  public async total({}) {
    var result = await ConvenioModule.countDocuments();
    return result;
  }
  public async search(query?: any): Promise<Array<IConvenio>>;
  public async search(
    search: string | any,
    params2?: number,
    params3?: number
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { nombre: { $regex: search, $options: "i" } },
        //{ entidades: { $regex: search, $options: "i" } },

        //Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listConvenio: Array<IConvenio> = await ConvenioModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
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
    let result = await ConvenioModule.updateOne({ _id: id }, { $set: convenio });
    return result;
  }
  public async deleteConvenio(id: string) {
    let result = await ConvenioModule.deleteOne({ _id: id });
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

  public async addFiles(idcv: string, idFile: string) {
    let convenio = await ConvenioModule.findOne({ _id: idcv });
    if (convenio != null) {
      var fil = await filesModule.findOne({ _id: idFile });
      if (fil != null) {
        var checkrol: Array<IFilescv> = convenio.files.filter((item) => {
          if (fil._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          convenio.files.push(fil);
          return await convenio.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async addDesem(idcv: string, idFile: string) {
    let convenio = await ConvenioModule.findOne({ _id: idcv });
    if (convenio != null) {
      var fil = await transfeModel.findOne({ _id: idFile });
      if (fil != null) {
        var checkrol: Array<ITransferencia> = convenio.transferencia.filter(
          (item) => {
            if (fil._id.toString() == item._id.toString()) {
              return true;
            }
            return false;
          }
        );
        if (checkrol.length == 0) {
          convenio.transferencia.push(fil);
          return await convenio.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async addfinanc(idcv: string, idFile: string) {
    let convenio = await ConvenioModule.findOne({ _id: idcv });
    if (convenio != null) {
      var fil = await financModule.findOne({ _id: idFile });
      if (fil != null) {
        var checkrol: Array<IFinaciadoras> = convenio.financiadoras.filter((item) => {
          if (fil._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          convenio.financiadoras.push(fil);
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
