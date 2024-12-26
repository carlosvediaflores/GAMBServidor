import facturaModel, { IFactura } from "../models/facturas";
class BussFactura {
  constructor() {}
  public async readFactura(): Promise<Array<IFactura>>;
  public async readFactura(id: string): Promise<IFactura>;
  public async readFactura(
    query?: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IFactura>>;

  public async readFactura(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IFactura> | IFactura> {
    if (params1 && typeof params1 == "string") {
      var result: IFactura = await facturaModel.findOne({ _id: params1 })
      .populate("encargadoControl")
      .populate({
        path: "conductor",
        model: "User",
        populate: {
          path: "cargo",
          model: "Subdirecciones",
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
          populate: { path: "user", model: "User" },
        },
      })
      .populate({
        path: "autorizacion",
        model: "act_autorizations",
        populate: {
          path: "conductor",
          model: "User",
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
      let listFactura: Array<IFactura> = await facturaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("encargadoControl")
        .populate({
          path: "conductor",
          model: "User",
          populate: {
            path: "cargo",
            model: "Subdirecciones",
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
            populate: { path: "user", model: "User" },
          },
        })
        .populate({
          path: "autorizacion",
          model: "act_autorizations",
          populate: {
            path: "conductor",
            model: "User",
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
        
      return listFactura;
    } else {
      let listFactura: Array<IFactura> = await facturaModel.find().populate("id_programa");
      return listFactura;
    }
  }
  public async searchFactura(query?: any): Promise<Array<IFactura>>;
  public async searchFactura(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listFactura: Array<IFactura> = await facturaModel.find(filter).sort({ _id: -1 })
    return listFactura;
  }
  public async readFacturaCod(codigo: string | any): Promise<IFactura>;
  public async readFacturaCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IFactura> | IFactura> {
    if (params1 && typeof params1 == "string") {
      var result: IFactura = await facturaModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addFactura(Factura: any) {
    try {
      let FacturaDb = new facturaModel(Factura);
      let result = await FacturaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async getNumFactura() {
    var result = await facturaModel
      .findOne()
      .limit(1)
      .sort({ _id: -1 });
    return result;
  }
  public async updateFactura(id: string, Factura: any) {
    let result = await facturaModel.updateOne({ _id: id }, { $set: Factura });
    return result;
  }
  public async deleteFactura(id: string) {
    let result = await facturaModel.deleteOne({ _id: id });
    return result;
  }
  public async updatePushFactura(id: string, factura: any) {
      let result = await facturaModel.updateOne(
        { _id: id },
        { $push: factura }
      );
      return result;
    }
}
export default BussFactura;
