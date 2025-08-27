import PrinterService from "../../../printer";
import { printDescargoGasto, printDesemFuente } from "../../../reports/almacenes";
import gastoModule, { Igastos } from "../models/gastos";
class BussGasto {
  constructor(
     private readonly printerService: PrinterService = new PrinterService()
  ) {}
  public async readGasto(): Promise<Array<Igastos>>;
  public async readGasto(id: string): Promise<Igastos>;
  public async readGasto(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<Igastos>>;

  public async readGasto(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<Igastos> | Igastos> {
    if (params1 && typeof params1 == "string") {
      var result: Igastos = await gastoModule
        .findOne({ _id: params1 })
        .populate("idSolicitante")
        .populate("idCombustible")
        .populate("idPartida")
        .populate("idVehiculo")
        .populate("idTipoDesembolso")
        .populate("idFuente");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let Gasto: Array<Igastos> = await gastoModule
        .find(params1)
        .populate("idSolicitante")
        .populate("idCombustible")
        .populate("idPartida")
        .populate("idVehiculo")
        .populate("idTipoDesembolso")
        .populate("idFuente")
        .skip(skip)
        .limit(limit)
        .sort(order);

      return Gasto;
    } else {
      let Gasto: Array<Igastos> = await gastoModule
        .find()
        .populate("idSolicitante")
        .populate("idCombustible")
        .populate("idPartida")
        .populate("idVehiculo")
        .populate("idTipoDesembolso")
        .populate("idFuente");

      return Gasto;
    }
  }

  public async addGasto(Gasto: Igastos) {
    try {
      let GastoDb = new gastoModule(Gasto);
      let result = await GastoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  
  public async getGasto() {
    const resp = await gastoModule
      .find()
      .populate("beneficiario")
      .populate("idFuentes")
      .populate("idUser");
    return resp;
  }
  public async updateGasto(id: string, Gasto: any) {
    let result = await gastoModule.updateOne(
      { _id: id },
      { $set: Gasto }
    );
    return result;
  }
    public async updateGastoMany( Gasto: any) {
    let result = await gastoModule.updateMany(
      { $set: Gasto }
    );
    return result;
  }
  public async deleteGasto(id: string) {
    let result = await gastoModule.deleteOne({ _id: id });
    return result;
  }
  // ✅ Verifica si ya existe un número + tipo + gestión
  public async findByNumeroTipoGestion(
    numero: number,
    tipoGasto: string,
    gestion: number
  ): Promise<Igastos | null> {
    return await gastoModule.findOne({
      numero,
      tipoGasto,
      gestion,
    });
  }
  // Imprime detalle Gasto
    public async printDesemFuente(id: string, user: any) {
      const Gasto: any = await gastoModule
        .findOne({ _id: id })
        .populate("beneficiario")
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "idFuente", model: "alm_fuente" },
        })
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "beneficiario", model: "User" },
        });
      //  console.log('Desem', Gasto, user);
        
      let docDefinition;
     
        docDefinition = printDesemFuente(Gasto, user); 
     
      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }
     public async printQueryGastos(data?: any) {
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

        const docDefinition = printDescargoGasto(data);
        const doc = this.printerService.createPdf(docDefinition);
        return doc;
      }
}
export default BussGasto;
