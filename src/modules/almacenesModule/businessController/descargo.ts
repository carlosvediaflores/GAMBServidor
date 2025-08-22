import PrinterService from "../../../printer";
import { printDesemFuente, printDetailDesemGasto } from "../../../reports/almacenes";
import descargoModule, { Idescargo } from "../models/descargo";
class Bussdescargo {
  constructor(
     private readonly printerService: PrinterService = new PrinterService()
  ) {}
  public async readDescargo(): Promise<Array<Idescargo>>;
  public async readDescargo(id: string): Promise<Idescargo>;
  public async readDescargo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<Idescargo>>;

  public async readDescargo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<Idescargo> | Idescargo> {
    if (params1 && typeof params1 == "string") {
      var result: Idescargo = await descargoModule
        .findOne({ _id: params1 })
        .populate("encargado")
        .populate("gastos")
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let descargo: Array<Idescargo> = await descargoModule
        .find(params1)
        .populate("encargado")
        .skip(skip)
        .limit(limit)
        .sort(order);

      return descargo;
    } else {
      let descargo: Array<Idescargo> = await descargoModule
        .find()
        .populate("encargado")

      return descargo;
    }
  }

  public async addDescargo(descargo: Idescargo) {
    try {
      let descargoDb = new descargoModule(descargo);
      let result = await descargoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  
  public async getDescargo() {
    const resp = await descargoModule
      .find()
      .populate("encargado")
      .populate("idFuentes")
      .populate("idUser");
    return resp;
  }
  public async updateDescargo(id: string, descargo: any) {
    let result = await descargoModule.updateOne(
      { _id: id },
      { $set: descargo }
    );
    return result;
  }
  public async deleteDescargo(id: string) {
    let result = await descargoModule.deleteOne({ _id: id });
    return result;
  }
  // ✅ Verifica si ya existe un número + tipo + gestión
  public async findByNumeroTipoGestion(
    numero: number,
    tipodescargo: string,
    gestion: number
  ): Promise<Idescargo | null> {
    return await descargoModule.findOne({
      numero,
      tipodescargo,
      gestion,
    });
  }

  // ✅ Obtiene el siguiente número disponible para un tipo y gestión
  public async getNextNumero(
    tipodescargo: string,
    gestion: number
  ): Promise<number> {
    const ultimo = await descargoModule
      .findOne({ tipodescargo, gestion })
      .sort({ numero: -1 })
      .lean();

    return ultimo ? ultimo.numero + 1 : 1;
  }

  // Imprime detalle descargo
    public async printDesemFuente(id: string, user: any) {
      const descargo: any = await descargoModule
        .findOne({ _id: id })
        .populate("encargado")
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "idFuente", model: "alm_fuente" },
        })
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "encargado", model: "User" },
        });
      //  console.log('Desem', descargo, user);
        
      let docDefinition;
     
        docDefinition = printDesemFuente(descargo, user); 
     
      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }

     // Imprime detalle descargo
    public async printDetailDesemGasto(id: string, user: any) {
      const descargo: any = await descargoModule
        .findOne({ _id: id })
        .populate("beneficiario")
        .populate({
          path: "gastos",
          model: "alm_gasto",
          populate: [
            {
              path: "idPartida",
              model: "partidas",
            },
            {
              path: "idCombustible",
              model: "alm_vale",
            },
          ],
        })
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
        //console.log('Desem', descargo, user);
        
      let docDefinition;

        docDefinition = printDetailDesemGasto(descargo, user);

      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }
}
export default Bussdescargo;
