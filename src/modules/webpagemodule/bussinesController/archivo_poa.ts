import archivoPoaModule, { IArchivoPoa } from "../models/archivo_poa";

class BussArchivoPoa {
  constructor() {}
  public async readArchivoPoa(): Promise<Array<IArchivoPoa>>;
  public async readArchivoPoa(id: string): Promise<IArchivoPoa>;
  public async readArchivoPoa(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IArchivoPoa>>;

  public async readArchivoPoa(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IArchivoPoa> | IArchivoPoa> {
    if (params1 && typeof params1 == "string") {
      var result: IArchivoPoa = await archivoPoaModule
        .findOne({ _id: params1 })
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listArchivoPoa: Array<IArchivoPoa> = await archivoPoaModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
      return listArchivoPoa;
    } else {
      let listArchivoPoa: Array<IArchivoPoa> = await archivoPoaModule
        .find()
      return listArchivoPoa;
    }
  }
  public async total({}) {
    var result = await archivoPoaModule.countDocuments();
    return result;
  }
  public async readArchivoPoaFile(archivo: string): Promise<IArchivoPoa>;
  public async readArchivoPoaFile(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IArchivoPoa> | IArchivoPoa> {
    if (params1 && typeof params1 == "string") {
      var result: IArchivoPoa = await archivoPoaModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async addArchivoPoa(ArchivoPoa: IArchivoPoa) {
    try {
      let ArchivoPoaDb = new archivoPoaModule(ArchivoPoa);
      let result = await ArchivoPoaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateArchivoPoa(id: string, ArchivoPoa: any) {
    let result = await archivoPoaModule.updateOne({ _id: id }, { $set: ArchivoPoa });
    return result;
  }
  public async deleteArchivoPoa(id: string) {
    let result = await archivoPoaModule.deleteOne({ _id: id });
    return result;
  }
}
export default BussArchivoPoa;
