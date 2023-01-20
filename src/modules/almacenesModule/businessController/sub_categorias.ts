import subCategoriaModel, { ISubCategoria } from "../models/sub_categorias";
class BussSubCategoria {
  constructor() {}
  public async readSubCategoria(): Promise<Array<ISubCategoria>>;
  public async readSubCategoria(id: string): Promise<ISubCategoria>;
  public async readSubCategoria(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ISubCategoria>>;

  public async readSubCategoria(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?:any
  ): Promise<Array<ISubCategoria> | ISubCategoria> {
    if (params1 && typeof params1 == "string") {
      var result: ISubCategoria = await (await subCategoriaModel.findOne({ _id: params1 })).populate(" id_partida");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listSubCategoria: Array<ISubCategoria> = await subCategoriaModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .populate(" id_partida");
      return listSubCategoria;
    } else {
      let listSubCategoria: Array<ISubCategoria> = await subCategoriaModel.find().populate(" id_partida");
      return listSubCategoria;
    }
  }
  public async readSubCategoriaCod(codigo: string | any): Promise<ISubCategoria>;
  public async readSubCategoriaCod(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<ISubCategoria> | ISubCategoria> {
    if (params1 && typeof params1 == "string") {
      var result: ISubCategoria = await subCategoriaModel.findOne({
        codigo: params1,
      });
      return result;
    }
  }
  public async searchSubCategoria(query?: any): Promise<Array<ISubCategoria>>;
  public async searchSubCategoria(
    search: string | any,
  ) {
    var filter = {
      $or: [
        { codigo: { $regex: search, $options: "i" } },
        { denominacion: { $regex: search, $options: "i" } }
      ],
    };
    let listSearchSubCat: Array<ISubCategoria> = await subCategoriaModel.find(filter).sort({ _id: -1 })
    return listSearchSubCat;
  }
  public async addSubCategoria(subcategoria: ISubCategoria) {
    try {
      let subcategoriaDb = new subCategoriaModel(subcategoria);
      let result = await subcategoriaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateSubCategoria(id: string, subcategoria: any) {
    let result = await subCategoriaModel.update({ _id: id }, { $set: subcategoria });
    return result;
  }
  public async deleteSubCategoria(id: string) {
    let result = await subCategoriaModel.remove({ _id: id });
    return result;
  }
}
export default BussSubCategoria;
