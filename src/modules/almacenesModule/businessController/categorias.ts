import categoriaModel, { ICategoria } from "../models/categorias";
class BussCategoria {
  constructor() {}
  public async readCategoria(): Promise<Array<ICategoria>>;
  public async readCategoria(id: string): Promise<ICategoria>;
  public async readCategoria(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ICategoria>>;

  public async readCategoria(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<ICategoria> | ICategoria> {
    if (params1 && typeof params1 == "string") {
      var result: ICategoria = await categoriaModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listCategoria: Array<ICategoria> = await categoriaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listCategoria;
    } else {
      let listCategoria: Array<ICategoria> = await categoriaModel.find();
      return listCategoria;
    }
  }
  public async searchCat(query?: any): Promise<Array<ICategoria>>;
  public async searchCat(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } },
      ],
    };
    let listConvenio: Array<ICategoria> = await categoriaModel.find(filter).sort({ _id: -1 })
    return listConvenio;
  }
  public async readCategoriaCod(codigo: string | any): Promise<ICategoria>;
  public async readCategoriaCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<ICategoria> | ICategoria> {
    if (params1 && typeof params1 == "string") {
      var result: ICategoria = await categoriaModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async addCategoria(categoria: ICategoria) {
    try {
      let categoriaDb = new categoriaModel(categoria);
      let result = await categoriaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateCategoria(id: string, categoria: any) {
    let result = await categoriaModel.updateOne({ _id: id }, { $set: categoria });
    return result;
  }
  public async deleteCategoria(id: string) {
    let result = await categoriaModel.deleteOne({ _id: id });
    return result;
  }
}
export default BussCategoria;
