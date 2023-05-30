import ArchivoModel, { IArchivo } from "../models/archivo";
class BussnesArchivo {
  public async readArch(): Promise<Array<IArchivo>>;
  public async readArch(id: string): Promise<IArchivo>;
  public async readArch(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IArchivo>>;

  public async readArch(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IArchivo> | IArchivo> {
    if (params1 && typeof params1 == "string") {
      var result: IArchivo = await ArchivoModel.findOne({ _id: params1 });
      //var result: IOrganizacion = await OrganizacionModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listArch: Array<IArchivo> = await ArchivoModel.find(params1)
        .skip(skip)
        .limit(limit);
      return listArch;
    } else {
      let listArch: Array<IArchivo> = await ArchivoModel.find();
      return listArch;
    }
  }
  public async addArch(archivo: IArchivo) {
    try {
      let archDb = new ArchivoModel(archivo);
      let result = await archDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateArch(id: string, arch: any) {
    let result = await ArchivoModel.updateOne({ _id: id }, { $set: arch });
    return result;
  }
  public async deleteArch(id: string) {
    let result = await ArchivoModel.remove({ _id: id });
    return result;
  }
}
export default BussnesArchivo;
