import partidaModel, { IPartida } from "../models/partidas";
class BussPartida {
  constructor() {}
  public async partidasAlm() {
    var result = await partidaModel.find().populate("partidas");
    return result;
  }
  public async updatePartida(id: string, Partida: any) {
    let result = await partidaModel.update({ _id: id }, { $set: Partida });
    return result;
  }
  public async addPartida(Egreso: IPartida) {
    try {
      let PartidaDb = new partidaModel(Egreso);
      let result = await PartidaDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
}
export default BussPartida;
