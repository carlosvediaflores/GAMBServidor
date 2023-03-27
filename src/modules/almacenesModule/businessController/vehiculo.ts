import vehiculoModel, { IVehiculo } from "../models/vehiculo";
class BussVehiculo {
  constructor() {}
  public async readVehiculo(): Promise<Array<IVehiculo>>;
  public async readVehiculo(id: string): Promise<IVehiculo>;
  public async readVehiculo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IVehiculo>>;

  public async readVehiculo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IVehiculo> | IVehiculo> {
    if (params1 && typeof params1 == "string") {
      var result: IVehiculo = await vehiculoModel
        .findOne({ _id: params1 })
        .populate("idChofer");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listVehiculo: Array<IVehiculo> = await vehiculoModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate("idChofer");
      return listVehiculo;
    } else {
      let listVehiculos: Array<IVehiculo> = await vehiculoModel
        .find()
        .populate("idChofer");
      return listVehiculos;
    }
  }
  /* public async searchVehiculo(query?: any): Promise<Array<IVehiculo>>;
  public async searchVehiculo(search: string | any) {
    var filter = {
      $or: [
        { 'idArticulo._id': { $regex: search, $options: "i" } },
        /* { catProgra: { $regex: search, $options: "i" } },
        { factura: { $regex: search, $options: "i" } },
        { estadoVehiculo: { $regex: search, $options: "i" } }, 
      ],
    };
    console.log(filter.$or)
    let listVehiculo: Array<IVehiculo> = await vehiculoModel
      .find({ 'idArticulo.codigo': search })
      .sort({ createdAt: -1 })
      .populate("idArticulo")
      .populate("idEntrada");
    return listVehiculo;
  } */

  public async searchVehiculo(search:string) {
    let listVehiculo: any  = await vehiculoModel
    .find({estadoVehiculo:'EXISTE', idProducto:search})
    .sort({ createdAt: -1 })
    .populate("idChofer");
  return listVehiculo;
  }
  

  public async addVehiculo(Vehiculo: IVehiculo) {
    try {
      let VehiculoDb = new vehiculoModel(Vehiculo);
      let result = await VehiculoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateVehiculo(id: string, Vehiculo: any) {
    let result = await vehiculoModel.updateOne({ _id: id }, { $set: Vehiculo });
    return result;
  }
  public async deleteVehiculo(id: string) {
    let result = await vehiculoModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussVehiculo;
