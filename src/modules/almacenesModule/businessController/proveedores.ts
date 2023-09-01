import proveedorModel, { IProveedor } from "../models/proveedores";
class BussProveedor {
  constructor() {}
  public async readProveedor(): Promise<Array<IProveedor>>;
  public async readProveedor(id: string): Promise<IProveedor>;
  public async readProveedor(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IProveedor>>;

  public async readProveedor(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IProveedor> | IProveedor> {
    if (params1 && typeof params1 == "string") {
      var result: IProveedor = await proveedorModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listProveedor: Array<IProveedor> = await proveedorModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listProveedor;
    } else {
      let listProveedor: Array<IProveedor> = await proveedorModel.find();
      return listProveedor;
    }
  }
  public async total({}) {
    var result = await proveedorModel.countDocuments();
    return result;
  }
  public async readProveedorCod(codigo: string | any): Promise<IProveedor>;
  public async readProveedorCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IProveedor> | IProveedor> {
    if (params1 && typeof params1 == "string") {
      var result: IProveedor = await proveedorModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async searchProveedor(query?: any): Promise<Array<IProveedor>>;
  public async searchProveedor(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { compania: { $regex: search, $options: "i" } },
        { representante: { $regex: search, $options: "i" } },
        { razon_social: { $regex: search, $options: "i" } }
      ],
    };
    let listPrograma: Array<IProveedor> = await proveedorModel.find(filter).sort({ _id: -1 })
    return listPrograma;
  }
  public async addProveedor(Proveedor: IProveedor) {
    try {
      let proveedorDb = new proveedorModel(Proveedor);
      let result = await proveedorDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateProveedor(id: string, proveedor: any) {
    let result = await proveedorModel.updateOne({ _id: id }, { $set: proveedor });
    return result;
  }
  public async deleteProveedor(id: string) {
    let result = await proveedorModel.remove({ _id: id });
    return result;
  }
}
export default BussProveedor;
