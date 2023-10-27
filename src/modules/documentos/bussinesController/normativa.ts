import normativaModel, { INormativa } from "../models/normativa";

class BussNormativa {
  constructor() {}

  //Listar Buscar Filtrar
  public async readNormativa(): Promise<Array<INormativa>>;
  public async readNormativa(id: string): Promise<INormativa>;
  public async readNormativa(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<INormativa>>;

  public async readNormativa(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<INormativa> | INormativa> {
    if (params1 && typeof params1 == "string") {
      var result: INormativa = (
        await normativaModel.findOne({ _id: params1 })
      ).populate({
        path: "tipo_normativa",
        model: "doc_tipoNormativas",
        populate: {
          path: "normativa",
          model: "doc_normativas",
        },
      });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listNormativa: Array<INormativa> = await normativaModel
        .find(params1)
        .populate({
          path: "tipo_normativa",
          model: "doc_tipoNormativas",
          populate: {
            path: "normativa",
            model: "doc_normativas",
          },
        })
        .skip(skip)
        .limit(limit)
        .sort(order);
      return listNormativa;
    } else {
      let listNormativas: Array<INormativa> = await normativaModel
        .find()
        .populate({
          path: "tipo_normativa",
          model: "doc_tipoNormativas",
          populate: {
            path: "normativa",
            model: "doc_normativas",
          },
        });
      return listNormativas;
    }
  }

  //Crear
  public async addNormativa(Normativa: INormativa) {
    try {
      let NormativaDb = new normativaModel(Normativa);
      let result = await NormativaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //Editar
  public async updateNormativa(id: string, Normativa: any) {
    let result = await normativaModel.updateOne(
      { _id: id },
      { $set: Normativa }
    );
    return result;
  }
  //Ver Archivo
  public async readNormativaFile(uri: string) {
    let result = await normativaModel.findOne({ nameFile: uri });
    return result;
  }
  //eliminar
  public async deleteNormativa(id: string) {
    let result = await normativaModel.deleteOne({ _id: id });
    return result;
  }
}

export default BussNormativa;
