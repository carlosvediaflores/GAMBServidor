import { printQueryFuente } from "../../../reports/almacenes";
import PrinterService from "../../../printer";
import desemFuenteModule, { IdesemFuente } from "../models/desemFuente";

class BussDeseFuente {
  constructor(
    private readonly printerService: PrinterService = new PrinterService()
  ) {}
  public async readDesemFuente(): Promise<Array<IdesemFuente>>;
  public async readDesemFuente(id: string): Promise<IdesemFuente>;
  public async readDesemFuente(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IdesemFuente>>;

  public async readDesemFuente(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IdesemFuente> | IdesemFuente> {
    if (params1 && typeof params1 == "string") {
      var result: IdesemFuente = await desemFuenteModule
        .findOne({ _id: params1 })
        .populate("beneficiario")
        .populate({ path: "idDesembolso", model: "alm_desembolso" })
        .populate({ path: "idFuente", model: "alm_fuente" });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let desembolso: Array<IdesemFuente> = await desemFuenteModule
        .find(params1)
        .populate("beneficiario")
        .populate({ path: "idDesembolso", model: "alm_desembolso" })
        .populate({ path: "idFuente", model: "alm_fuente" })
        .skip(skip)
        .limit(limit)
        .sort(order);

      return desembolso;
    } else {
      let desembolso: Array<IdesemFuente> = await desemFuenteModule
        .find()
        .populate("beneficiario")
        .populate({ path: "idDesembolso", model: "alm_desembolso" })
        .populate({ path: "idFuente", model: "alm_fuente" });
      return desembolso;
    }
  }

  public async addDesemFuente(desembolso: IdesemFuente) {
    try {
      let desembolsoDb = new desemFuenteModule(desembolso);
      let result = await desembolsoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateDesemFuente(id: string, desembolso: any) {
    let result = await desemFuenteModule.updateOne(
      { _id: id },
      { $set: desembolso }
    );
    return result;
  }
  public async deleteDesemFuente(id: string) {
    let result = await desemFuenteModule.deleteOne({ _id: id });
    return result;
  }
  public async printQueryFuente(data?: any) {
    // const listGasto: any = await gastoModule
    //   .find(filter)
    //   .populate("idSolicitante")
    //   .populate("idCombustible")
    //   .populate("idPartida")
    //   .populate("idVehiculo")
    //   .populate("idTipoDesembolso")
    //   .populate({
    //     path: "idFuentes",
    //     model: "alm_desemFuente",
    //     populate: { path: "idFuente", model: "alm_fuente" },
    //   })
    //   .sort({ fecha: -1 });
    // console.log("listGasto", data);

    const docDefinition = printQueryFuente(data);
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
  // ✅ Verifica si ya existe un número + tipo + gestión
  // public async findByNumeroTipoGestion(
  //   numero: number,
  //   tipoDesembolso: string,
  //   gestion: number
  // ): Promise<IdesemFuente | null> {
  //   return await desemFuenteModule.findOne({
  //     numero,
  //     tipoDesembolso,
  //     gestion,
  //   });
  // }

  // ✅ Obtiene el siguiente número disponible para un tipo y gestión
  // public async getNextNumero(
  //   tipoDesembolso: string,
  //   gestion: number
  // ): Promise<number> {
  //   const ultimo = await desemFuenteModule
  //     .findOne({ tipoDesembolso, gestion })
  //     .sort({ numero: -1 })
  //     .lean();

  //   return ultimo ? ultimo.numero + 1 : 1;
  // }
}
export default BussDeseFuente;
