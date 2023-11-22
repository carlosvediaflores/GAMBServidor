import prestamoModel, { IPrestamos } from "../models/prestamos";

class BussPrestamo {
  constructor() {}

  //Listar Buscar Filtrar
  public async readPrestamo(): Promise<Array<IPrestamos>>;
  public async readPrestamo(id: string): Promise<IPrestamos>;
  public async readPrestamo(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPrestamos>>;

  public async readPrestamo(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPrestamos> | IPrestamos> {
    if (params1 && typeof params1 == "string") {
      var result: IPrestamos = (await prestamoModel.findOne({ _id: params1 }))
        .populate("archivos")
        .populate("amortizacion");
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPrestamo: Array<IPrestamos> = await prestamoModel
        .find(params1)
        .populate("archivos")
        .populate("amortizacion")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listPrestamo;
    } else {
      let listPrestamos: Array<IPrestamos> = await prestamoModel
        .find()
        .populate("archivos")
        .populate("amortizacion")
      return listPrestamos;
    }
  }

  //Crear
  public async addPrestamo(Prestamo: IPrestamos) {
    try {
      let PrestamoDb = new prestamoModel(Prestamo);
      let result = await PrestamoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updatePrestamo(id: string, Prestamo: any) {
    let result = await prestamoModel.updateOne({ _id: id }, { $set: Prestamo });
    return result;
  }
  //eliminar
  public async deletePrestamo(id: string) {
    let result = await prestamoModel.deleteOne({ _id: id });
    return result;
  }
  //Agregar idArchivo a Prestamo
  public async updatePushPrestamo(idPrest: string, idArchivo: any) {
    let result = await prestamoModel.updateOne(
      { _id: idPrest },
      { $push: { archivos: idArchivo } }
    );
    return result;
  }
  //Remover IdArchivo de Prestamo
  public async removePrestamoId(idPrest: string, idArchivo: any) {
    let result = await prestamoModel.updateOne(
      { _id: idPrest },
      { $pull: { archivos: idArchivo } }
    );
    return result;
  }
  //Agregar idArchivo a Prestamo
  public async updatePushAmortizacion(idPrest: string, idArchivoA: any) {
    let result = await prestamoModel.updateOne(
      { _id: idPrest },
      { $push: { amortizacion: idArchivoA } }
    );
    return result;
  }
  //Remover IdArchivo de Prestamo
  public async removeAmortizacionId(idPrest: string, idArchivo: any) {
    let result = await prestamoModel.updateOne(
      { _id: idPrest },
      { $pull: { amortizacion: idArchivo } }
    );
    return result;
  }
}

export default BussPrestamo;
