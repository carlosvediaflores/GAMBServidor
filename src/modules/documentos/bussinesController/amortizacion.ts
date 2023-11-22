import amortizacionModel, { IAmortizacion } from "../models/amortizacion";

class BussAmortizacion {
  constructor() {}

  //Listar Buscar Filtrar
  public async readAmortizacion(): Promise<Array<IAmortizacion>>;
  public async readAmortizacion(id: string): Promise<IAmortizacion>;
  public async readAmortizacion(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IAmortizacion>>;

  public async readAmortizacion(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IAmortizacion> | IAmortizacion> {
    if (params1 && typeof params1 == "string") {
      var result: IAmortizacion = (
        await amortizacionModel.findOne({ _id: params1 })
      ).populate({
        path: "prestamo",
        model: "doc_prestamos",
        populate: {
          path: "archivos",
          model: "doc_fileprestamos",
        },
      });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listAmortizacion: Array<IAmortizacion> = await amortizacionModel
        .find(params1)
        .populate({
            path: "prestamo",
            model: "doc_prestamos",
            populate: {
              path: "archivos",
              model: "doc_fileprestamos",
            },
        })
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listAmortizacion;
    } else {
      let listAmortizacions: Array<IAmortizacion> = await amortizacionModel
        .find()
        .populate({
            path: "prestamo",
            model: "doc_prestamos",
            populate: {
              path: "archivos",
              model: "doc_fileprestamos",
            },
        });
      return listAmortizacions;
    }
  }

  //Crear
  public async addAmortizacion(Amortizacion: IAmortizacion) {
    try {
      let AmortizacionDb = new amortizacionModel(Amortizacion);
      let result = await AmortizacionDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateAmortizacion(id: string, Amortizacion: any) {
    let result = await amortizacionModel.updateOne(
      { _id: id },
      { $set: Amortizacion }
    );
    return result;
  }
  //Ver Archivo
  public async readAmortizacionFile(uri: string) {
    let result = await amortizacionModel.findOne({ nameFile: uri });
    return result;
  }
  //eliminar
  public async deleteAmortizacion(id: string) {
    let result = await amortizacionModel.deleteOne({ _id: id });
    return result;
  }
  //Agregar idNormativa a TipoNormativa
  public async updatePusPrestamo(idAmorti: string, idPrestamo: any) {
    let result = await amortizacionModel.updateOne(
      { _id: idAmorti },
      { $push: { prestamo: idPrestamo } }
    );
    return result;
  }
  //Remover IdNormativa de TipoNormativa
  public async removePrestamoId(idTipo: string, idNorma: any) {
    let result = await amortizacionModel.updateOne(
      { _id: idTipo },
      { $pull: { normativa: idNorma } }
    );
    return result;
  }
}

export default BussAmortizacion;
