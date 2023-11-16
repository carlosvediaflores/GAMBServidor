import filePrestamoModel, { IFilePrestamos } from "../models/filePrestamo";

class BussFilePrestamo {
  constructor() {}

  //Listar Buscar Filtrar
  public async readFilPrestamo(): Promise<Array<IFilePrestamos>>;
  public async readFilPrestamo(id: string): Promise<IFilePrestamos>;
  public async readFilPrestamo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IFilePrestamos>>;

  public async readFilPrestamo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IFilePrestamos> | IFilePrestamos> {
    if (params1 && typeof params1 == "string") {
      var result: IFilePrestamos = (await filePrestamoModel.findOne({ _id: params1 }))
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPrestamo: Array<IFilePrestamos> = await filePrestamoModel
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listPrestamo;
    } else {
      let listPrestamos: Array<IFilePrestamos> = await filePrestamoModel
        .find()
      return listPrestamos;
    }
  }

  //Crear
  public async addFilePrestamo(Prestamo: IFilePrestamos) {
    try {
      let filePrestamoDb = new filePrestamoModel(Prestamo);
      let result = await filePrestamoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Ver Archivo
  public async readFilePrestamo(uri: string) {
    let result = await filePrestamoModel.findOne({ nameFile: uri });
    return result;
  }

  //eliminar
  public async deleteFilePrestamo(id: string) {
    let result = await filePrestamoModel.deleteOne({ _id: id });
    return result;
  }
}

export default BussFilePrestamo;
