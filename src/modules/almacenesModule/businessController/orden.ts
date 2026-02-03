import ordenModel, { IOrden } from "../models/orden";
import PrinterService from "../../../printer";
import {
  getReportsLubricantes,
  printDetalleFactura,
  printOrden,
  printVale,
  printVale2,
} from "../../../reports/almacenes";
import { log } from "console";
class BussOrden {
  constructor(
    private readonly printerService: PrinterService = new PrinterService()
  ) {}
  public async readOrden(): Promise<Array<IOrden>>;
  public async readOrden(id: string): Promise<IOrden>;
  public async readOrden(
    query?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IOrden>>;

  public async readOrden(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IOrden> | IOrden> {
    if (params1 && typeof params1 == "string") {
      var result: IOrden = await ordenModel
        .findOne({ _id: params1 })
        .populate("encargadoControl", "_id ci email username surnames roles")
        .populate("idFacturas")
        .populate({
          path: "idGasto",
          model: "alm_gasto",
          populate: [
            {
              path: "idDesembolso",
              model: "alm_desembolso",
            },
            {
              path: "idDesemFondo",
              model: "alm_desemFuente",
            },
          ],
        })
        .populate({
          path: "conductor",
          model: "User",
          select: "_id ci email username surnames roles",
          populate: {
            path: "cargo",
            model: "Subdirecciones",
            select: "_id nombresubdir unidad ",
          },
        })
        .populate("vehiculo")
        .populate("idProducto")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "unidadSolicitante",
            model: "Subdirecciones",
            populate: {
              path: "user",
              model: "User",
              select: "_id ci email username surnames roles",
            },
          },
        })
        .populate("unidadSolicitante")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "conductor",
            model: "User",
            select: "_id ci email username surnames roles",
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
          },
        });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listVale: Array<IOrden> = await ordenModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idFacturas")
        .populate("idGasto")
        .populate("unidadSolicitante")
        .populate("encargadoControl", "_id ci email username surnames roles")
        .populate({
          path: "conductor",
          model: "User",
          select: "_id ci email username surnames roles",
          populate: {
            path: "cargo",
            model: "Subdirecciones",
            select: "_id nombresubdir unidad ",
          },
        })
        .populate("vehiculo")
        .populate("idProducto")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "unidadSolicitante",
            model: "Subdirecciones",
            populate: {
              path: "user",
              model: "User",
              select: "_id ci email username surnames roles",
            },
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "conductor",
            model: "User",
            select: "_id ci email username surnames roles",
          },
        })
        .populate("unidadSolicitante")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "vehiculo",
            model: "alm_vehiculos",
          },
        });

      return listVale;
    } else {
      let listVale: Array<IOrden> = await ordenModel
        .find()
        .populate("id_programa")
        .populate("idGasto");
      return listVale;
    }
  }
  public async addOrden(Orden: any) {
    try {
      let OrdenDb = new ordenModel(Orden);
      let result = await OrdenDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async getVales(params1: any, params2?: any) {
    var result = await ordenModel.find(params1).populate("idProducto");

    return result;
  }
  public async getValesAut(params1: any, params2?: any) {
    var result = await ordenModel
      .find(params1)
      .populate("idProducto")
      .populate({ path: "autorizacion", match: params2 });
    const filterConductor = result.filter((conductor: any) => {
      return conductor.autorizacion != null;
    });
    return filterConductor;
  }
  public async getNumOrden() {
    var result = await ordenModel.findOne().limit(1).sort({ _id: -1 });
    return result;
  }
  public async updateVale(id: string, Vale: any) {
    let result = await ordenModel.updateOne({ _id: id }, { $set: Vale });
    return result;
  }
  public async deleteVale(id: string) {
    let result = await ordenModel.deleteOne({ _id: id });
    return result;
  }
  public async updatePushFactura(id: string, factura: any) {
    let result = await ordenModel.updateOne({ _id: id }, { $push: factura });
    return result;
  }
  public async getValeAntiguo(numAntiguo: string) {
    let result = await ordenModel.findOne({ numAntiguo: numAntiguo });
    return result;
  }
  public async getReportsLubricantes(filter?: any) {
    const listFactura: any = await ordenModel
      .find(filter)
      .populate("conductor")
      .populate("vehiculo")
      .sort({ fecha: -1 });
    // console.log(listFactura);

    const docDefinition = getReportsLubricantes(listFactura);
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
  public async printVale(id: string, user: any, catPro: any) {
    const vale: any = await ordenModel
      .findOne({ _id: id })
      .populate("conductor")
      .populate("vehiculo")
      .populate({
        path: "autorizacion",
        model: "act_autorizations",
        populate: {
          path: "unidadSolicitante",
          model: "Subdirecciones",
          populate: {
            path: "user",
            model: "User",
            select: "_id ci email username surnames roles post",
          },
        },
      })
      .populate("idProducto")
      .populate("idFacturas");
    let docDefinition;
    if (vale.idFacturas.length === 0 && vale.idCompra) {
      docDefinition = printVale2(vale, user, catPro); // Usa printVale2 si la condición se cumple
    } else {
      docDefinition = printVale(vale, user, catPro); // Usa printVale si no se cumple
    }
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
  // Imprime detalle movimiento de fondo en avance
  public async printDetalleFactura(id: string, user: any) {
    const vale: any = await ordenModel
      .findOne({ _id: id })
      .populate("conductor")
      .populate("vehiculo")
      .populate({
        path: "autorizacion",
        model: "act_autorizations",
        populate: {
          path: "unidadSolicitante",
          model: "Subdirecciones",
          populate: {
            path: "user",
            model: "User",
            select: "_id ci email username surnames roles post",
          },
        },
      })
      .populate("idProducto")
      .populate("idFacturas");
    let docDefinition;

    docDefinition = printDetalleFactura(vale, user); // Usa printVale2 si la condición se cumple

    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  public async printOrden(id: string, user: any, catPro: any) {
      const orden: any = await ordenModel
        .findOne({ _id: id })
        .populate("conductor")
        .populate("vehiculo")
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "unidadSolicitante",
            model: "Subdirecciones",
            populate: {
              path: "user",
              model: "User",
              select: "_id ci email username surnames roles post",
            },
          },
        })
        .populate("unidadSolicitante")
        .populate("idProducto")
        .populate("idFacturas");
      let docDefinition;
      
        docDefinition = printOrden(orden, user, catPro); // Usa printorden2 si la condición se cumple
      
      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    }
}
export default BussOrden;

