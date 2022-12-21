import imgpostModule, { IPost } from "../models/imgpost";

class BussImgpost {
  constructor() {}
  public async readImgpost(): Promise<Array<IPost>>;
  public async readImgpost(id: string): Promise<IPost>;
  public async readImgpost(
    query: any,
    skip: number,
    limit: number,
    order: any
  ): Promise<Array<IPost>>;

  public async readImgpost(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IPost> | IPost> {
    if (params1 && typeof params1 == "string") {
      var result: IPost = await imgpostModule
        .findOne({ _id: params1 })
      return result;
    } else if (params1) {
      let skip = params2;
      let limit = params3;
      let listImgpost: Array<IPost> = await imgpostModule
        .find(params1)
        .skip(skip)
        .limit(limit)
        .sort(order)
      return listImgpost;
    } else {
      let listImgpost: Array<IPost> = await imgpostModule
        .find()
      return listImgpost;
    }
  }
  public async total({}) {
    var result = await imgpostModule.count();
    return result;
  }
  public async readImgpostFile(archivo: string): Promise<IPost>;
  public async readImgpostFile(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IPost> | IPost> {
    if (params1 && typeof params1 == "string") {
      var result: IPost = await imgpostModule.findOne({ archivo: params1 });
      return result;
    }
  }
  public async addImgpost(Imgpost: IPost) {
    try {
      let ImgpostDb = new imgpostModule(Imgpost);
      let result = await ImgpostDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async updateImgpost(id: string, Imgpost: any) {
    let result = await imgpostModule.update({ _id: id }, { $set: Imgpost });
    return result;
  }
  public async deleteImgpost(id: string) {
    let result = await imgpostModule.remove({ _id: id });
    return result;
  }
}
export default BussImgpost;
