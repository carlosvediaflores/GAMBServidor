import auditoriaModule, { IAuditoria } from "../models/auditoria";

class BussAuditoria {
  constructor() {}
  public async readAuditoria(): Promise<Array<IAuditoria>>;
  public async readAuditoria(id: string): Promise<IAuditoria>;
  public async readAuditoria(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IAuditoria>>;

  public async readAuditoria(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IAuditoria> | IAuditoria> {
    if (params1 && typeof params1 == "string") {
      var result: IAuditoria = await auditoriaModule
        .findOne({ _id: params1 })
        .populate("usuario")
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listAuditoria: Array<IAuditoria> = await auditoriaModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("usuario")
      return listAuditoria;
    } else {
      let listAuditoria: Array<IAuditoria> = await auditoriaModule
        .find()
        .populate("usuario")
      return listAuditoria;
    }
  }
  public async total({}) {
    var result = await auditoriaModule.count();
    return result;
  }
  public async readAuditoriaFile(archivo: string): Promise<IAuditoria>;
  public async readAuditoriaFile(
    params1?: string | any,
  ): Promise<Array<IAuditoria> | IAuditoria> {
    if (params1 && typeof params1 == "string") {
      var result: IAuditoria = await auditoriaModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async search(query?: any): Promise<Array<IAuditoria>>;
  public async search(
    search: string | any | boolean,
    params2?: number,
    params3?: number
  ) {
    var filter = {
        estado: true ,
      $or: [
        { resumen: { $regex: search, $options: "i" } }
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 100;
    let listAuditoria: Array<IAuditoria> = await auditoriaModule.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("usuario")
    return listAuditoria;
  }
  public async addAuditoria(Auditoria: IAuditoria) {
    try {
      let AuditoriaDb = new auditoriaModule(Auditoria);
      let result = await AuditoriaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateAuditoria(id: string, Auditoria: any) {
    let result = await auditoriaModule.updateOne({ _id: id }, { $set: Auditoria });
    return result;
  }
  public async deleteAuditoria(id: string) {
    let result = await auditoriaModule.remove({ _id: id });
    return result;
  }
}
export default BussAuditoria;
