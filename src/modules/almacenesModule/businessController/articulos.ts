import articulosModel, { IArticulo } from "../models/articulos";
class BussArticulo {
  constructor() {}
  public async readArticulo(): Promise<Array<IArticulo>>;
  public async readArticulo(id: string): Promise<IArticulo>;
  public async readArticulo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IArticulo>>;

  public async readArticulo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<IArticulo> | IArticulo> {
    if (params1 && typeof params1 == "string") {
      var result: IArticulo = await articulosModel.findOne({ _id: params1 }).populate("idPartida");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listArticulo: Array<IArticulo> = await articulosModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order).populate("idPartida");
      return listArticulo;
    } else {
      let listArticulos: Array<IArticulo> = await articulosModel.find().populate("idPartida");
      return listArticulos;
    }
  }
  public async searchArticulo(query?: any): Promise<Array<IArticulo>>;
  public async searchArticulo(
    search?: string | any,
    
  ) {
    let listArticulo: Array<IArticulo> = await articulosModel.find({nombre:search}).sort({ _id: -1 }).populate("idPartida")
    return listArticulo;
  }
  /* public async searchArticulo(query?: any): Promise<Array<IArticulo>>;
  public async searchArticulo(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { nombre: { $regex: search, $options: "i" } },
      ],
    };
    let listConvenio: Array<IArticulo> = await articulosModel.find(filter).sort({ _id: -1 }).populate("idPartida")
    return listConvenio;
  } */
  public async readArticuloCod(codigo: string | any): Promise<IArticulo>;
  public async readArticuloCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IArticulo> | IArticulo> {
    if (params1 && typeof params1 == "string") {
      var result: IArticulo = await articulosModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addArticulo(Articulo: IArticulo) {
    try {
      let ArticuloDb = new articulosModel(Articulo);
      let result = await ArticuloDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateArticulo(id: string, Articulo: any) {
    let result = await articulosModel.updateOne({ _id: id }, { $set: Articulo });
    return result;
  }
  public async deleteArticulo(id: string) {
    let result = await articulosModel.remove({ _id: id });
    return result;
  }
}
export default BussArticulo;
