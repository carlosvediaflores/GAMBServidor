import correspondenciaModel, {
  ICorrespondencia,
} from "../models/correspondencia";
class BussCorrespondencia {
  constructor() {}
  public async readCorrespondencia(): Promise<Array<ICorrespondencia>>;
  public async readCorrespondencia(id: string): Promise<ICorrespondencia>;
  public async readCorrespondencia(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<ICorrespondencia>>;

  public async readCorrespondencia(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<ICorrespondencia> | ICorrespondencia> {
    if (params1 && typeof params1 == "string") {
      var result: ICorrespondencia = await correspondenciaModel
        .findOne({ _id: params1 })
        .populate("idTipo")
        .populate("idSubTipo")
        .populate("idDependencia")
        .populate("idUsuario")
        .populate("via");

      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listCarpeta: Array<ICorrespondencia> = await correspondenciaModel
        .find(params1)
        .populate("idTipo")
        .populate("idSubTipo")
        .populate("idDependencia")
        .populate("idUsuario")
        .populate("via")
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listCarpeta;
    } else {
      let listCarpetas: Array<ICorrespondencia> = await correspondenciaModel
        .find()
        .populate("idTipo")
        .populate("idSubTipo")
        .populate("idDependencia")
        .populate("idUsuario")
        .populate("via");
      return listCarpetas;
    }
  }
  /*  public async total({}) {
    var result = await correspondenciaModel.countDocuments();
    return result;
  } */
  public async total(params1?: string | any) {
    let listSegui = await correspondenciaModel.countDocuments(params1);
    return listSegui;
  }
  public async getNuit() {
    var result = await correspondenciaModel.find().limit(1).sort({ _id: -1 });
    return result;
  }
  public async readCarpetaFile(archivo: string): Promise<ICorrespondencia>;
  public async readCarpetaFile(
    params1?: string | any
  ): Promise<Array<ICorrespondencia> | ICorrespondencia> {
    if (params1 && typeof params1 == "string") {
      var result: ICorrespondencia = await correspondenciaModel.findOne({
        archivo: params1,
      });
      return result;
    }
  }
  public async searchCorrespondencia(
    query?: any
  ): Promise<Array<ICorrespondencia>>;
  public async searchCorrespondencia(search: string | any) {
    var filter = {
      area: "Contabilidad",
      $or: [
        { nameCarpeta: { $regex: search, $options: "i" } },
        { gestion: { $regex: search, $options: "i" } },
        { tipo: { $regex: search, $options: "i" } },
        { lugar: { $regex: search, $options: "i" } },
      ],
    };
    let listCarpeta: Array<ICorrespondencia> = await correspondenciaModel
      .find(filter)
      .sort({ _id: -1 })
      .populate({
        path: "areaContabilidad",
        model: "arch_contabilidades",
        populate: {
          path: "idCarpeta",
          model: "arch_carpetas",
        },
      });
    return listCarpeta;
  }
  public async addCorrespondencia(Carpeta: ICorrespondencia) {
    try {
      let CarpetaDb = new correspondenciaModel(Carpeta);
      let result = await CarpetaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addContaId(idCarpeta: string, idArea: any) {
    let result = await correspondenciaModel.updateOne(
      { _id: idCarpeta },
      { $push: { areaContabilidad: idArea } }
    );
    return result;
  }
  public async removeContaId(idCarpeta: string, idArea: any) {
    let result = await correspondenciaModel.updateOne(
      { _id: idCarpeta },
      { $pull: { areaContabilidad: idArea } }
    );
    return result;
  }
  /* public async removeSub(idOr: string, organizacion: any) {
    let result = await OrganizacionModel.updateOne({ _id: idOr }, { $pull: organizacion })
    return result;
} */
  public async updateCorrespondencia(id: string, Carpeta: any) {
    let result = await correspondenciaModel.updateOne(
      { _id: id },
      { $set: Carpeta }
    );
    return result;
  }
  public async deleteCorrespondencia(id: string) {
    let result = await correspondenciaModel.deleteOne({ _id: id });
    return result;
  }
  //public async queryCorresp(query1: any): Promise<Array<ICorrespondencia>>;
  public async queryCorresp(search1: string | any) {
    let listCarpetas = await correspondenciaModel
      .findOne(search1)
      .sort({ createdAt: -1 })
      .populate("idTipo")
      .populate("idSubTipo")
      .populate("idDependencia")
      .populate("idUsuario")
      .populate("via");
    return listCarpetas;
    /* const filterCarpeta = listCarpetas.filter((carpeta: any) => {
      return carpeta.idCarpeta.length != 0;
    });
    return filterCarpeta; */
  }
  public async getFile(file: string) {   
    console.log(file);
    
    let result = await correspondenciaModel.findOne({fileName:file})
    .populate("idTipo")
      .populate("idSubTipo")
      .populate("idDependencia")
      .populate("idUsuario")
      .populate("via");
    return result;
  }
}
export default BussCorrespondencia;
