import partidasModel, { IPartidas } from "../models/partidasg";
class BussPartida {
  constructor() {}
  public async readPartida(): Promise<Array<IPartidas>>;
  public async readPartida(id: string): Promise<IPartidas>;
  public async readPartida(
    query: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IPartidas>>;

  public async readPartida(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPartidas> | IPartidas> {
    if (params1 && typeof params1 == "string") {
      var result: IPartidas = await partidasModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listPartida: Array<IPartidas> = await partidasModel
        .find(params1)
        .sort(order);
      return listPartida;
    } else {
      let listPartida: Array<IPartidas> = await partidasModel.find();
      return listPartida;
    }
  }
  public async readPartidaCod(codigo: number): Promise<IPartidas>;
  public async readPartidaCod(
    params1?: number | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IPartidas> | IPartidas> {
    if (params1) {
      var result: IPartidas = await partidasModel.findOne({ codigo: params1 });
      return result;
    }
  }
  public async addPartida(partida: IPartidas) {
    try {
      let partidaDb = new partidasModel(partida);
      let result = await partidaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updatePartida(id: string, partida: any) {
    let result = await partidasModel.updateOne({ _id: id }, { $set: partida });
    return result;
  }
  public async deletePartida(id: string) {
    let result = await partidasModel.remove({ _id: id });
    return result;
  }
}
export default BussPartida;
