import counterModel, { ICounter } from "../models/counter";
class BussCounter {
  constructor() {}
  public async totalVistas() {
    var result = await counterModel.find();
    return result;
  }
  public async updateVisitas(id: string, Counter: any) {
    let result = await counterModel.update({ _id: id }, { $set: Counter });
    return result;
  }
  public async addCounter(Egreso: ICounter) {
    try {
      let counterDb = new counterModel(Egreso);
      let result = await counterDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
}
export default BussCounter;
