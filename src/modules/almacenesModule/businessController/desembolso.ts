import PrinterService from "../../../printer";
import { printDesemFuente, printDetailDesemGasto } from "../../../reports/almacenes";
import desembolsoModule, { Idesembolso } from "../models/desembolso";
class BussDesembolso {
  constructor(
     private readonly printerService: PrinterService = new PrinterService()
  ) {}
  public async readDesembolso(): Promise<Array<Idesembolso>>;
  public async readDesembolso(id: string): Promise<Idesembolso>;
  public async readDesembolso(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<Idesembolso>>;

  public async readDesembolso(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<Idesembolso> | Idesembolso> {
    if (params1 && typeof params1 == "string") {
      var result: Idesembolso = await desembolsoModule
        .findOne({ _id: params1 })
        .populate("beneficiario")
        .populate("gastos")
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "idFuente", model: "alm_fuente" },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let desembolso: Array<Idesembolso> = await desembolsoModule
        .find(params1)
        .populate("beneficiario")
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "idFuente", model: "alm_fuente" },
        })
        .skip(skip)
        .limit(limit)
        .sort(order);

      return desembolso;
    } else {
      let desembolso: Array<Idesembolso> = await desembolsoModule
        .find()
        .populate("beneficiario")
        .populate({
          path: "idFuentes",
          model: "alm_desemFuente",
          populate: { path: "idFuente", model: "alm_fuente" },
        });

      return desembolso;
    }
  }

  public async addDesembolso(desembolso: Idesembolso) {
    try {
      let desembolsoDb = new desembolsoModule(desembolso);
      let result = await desembolsoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  
  public async getDesembolso() {
    const resp = await desembolsoModule
      .find()
      .populate("beneficiario")
      .populate("idFuentes")
      .populate("idUser");
    return resp;
  }
  public async updateDesembolso(id: string, desembolso: any) {
    let result = await desembolsoModule.updateOne(
      { _id: id },
      { $set: desembolso }
    );
    return result;
  }
  public async deleteDesembolso(id: string) {
    let result = await desembolsoModule.deleteOne({ _id: id });
    return result;
  }
  // ✅ Verifica si ya existe un número + tipo + gestión
  public async findByNumeroTipoGestion(
    numero: number,
    tipoDesembolso: string,
    gestion: number
  ): Promise<Idesembolso | null> {
    return await desembolsoModule.findOne({
      numero,
      tipoDesembolso,
      gestion,
    });
  }

  // ✅ Obtiene el siguiente número disponible para un tipo y gestión
  public async getNextNumero(
    tipoDesembolso: string,
    gestion: number
  ): Promise<number> {
    const ultimo = await desembolsoModule
      .findOne({ tipoDesembolso, gestion })
      .sort({ numero: -1 })
      .lean();

    return ultimo ? ultimo.numero + 1 : 1;
  }

  // Imprime detalle desembolso
    public async printDesemFuente(id: string, user: any) {
      const desembolso: any = await desembolsoModule
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
      //  console.log('Desem', desembolso, user);
        
      let docDefinition;
     
        docDefinition = printDesemFuente(desembolso, user); 
     
      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }

     // Imprime detalle desembolso
    public async printDetailDesemGasto(id: string, user: any) {
      const desembolso: any = await desembolsoModule
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
        //console.log('Desem', desembolso, user);
        
      let docDefinition;

        docDefinition = printDetailDesemGasto(desembolso, user);

      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }
}
export default BussDesembolso;
