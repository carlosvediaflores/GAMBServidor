import poaModule, { IPoa } from "../models/poa";
import archivoPoaModule, {IArchivoPoa} from "../models/archivo_poa";

class BussPoa {
  constructor() {}
  public async readPoa(): Promise<Array<IPoa>>;
  public async readPoa(id: string): Promise<IPoa>;
  public async readPoa(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPoa>>;

  public async readPoa(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPoa> | IPoa> {
    if (params1 && typeof params1 == "string") {
      var result: IPoa = await poaModule
        .findOne({ _id: params1 })
        .populate("usuario")
        .populate("ley")
        .populate("archivo");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPoa: Array<IPoa> = await poaModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario")
        .populate("ley")
        .populate("archivo");
      return listPoa;
    } else {
      let listPoa: Array<IPoa> = await poaModule
        .find()
        .populate("usuario")
        .populate("ley")
        .populate("archivo");
      return listPoa;
    }
  }
  public async total({}) {
    var result = await poaModule.count();
    return result;
  }
  /* public async readPoaFile(archivo: string): Promise<IPoa>;
  public async readPoaFile(
    params1?: string | any,
  ): Promise<Array<IPoa> | IPoa> {
    if (params1 && typeof params1 == "string") {
      var result: IPoa = await poaModule.findOne({ archivo: params1 });
      return result;
    }
  } */
  public async search(query?: any): Promise<Array<IPoa>>;
  public async search(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { titulo: { $regex: search, $options: "i" } },
        { detalle: { $regex: search, $options: "i" } },
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listPoa: Array<IPoa> = await poaModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("usuario")
      .populate("ley");
    return listPoa;
  }
  public async addPoa(Poa: IPoa) {
    try {
      let PoaDb = new poaModule(Poa);
      let result = await PoaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePoa(id: string, Poa: any) {
    let result = await poaModule.update({ _id: id }, { $set: Poa });
    return result;
  }
  public async deletePoa(id: string) {
    let result = await poaModule.remove({ _id: id });
    return result;
  }
  public async addArcivoPoa(idcv: string, idFile: string) {
    let archivo = await poaModule.findOne({ _id: idcv });
    if (archivo != null) {
      var fil = await archivoPoaModule.findOne({ _id: idFile });
      if (fil != null) {
        var checkrol: Array<IArchivoPoa> = archivo.archivo.filter((item) => {
          if (fil._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          archivo.archivo.push(fil);
          return await archivo.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
}
export default BussPoa;
