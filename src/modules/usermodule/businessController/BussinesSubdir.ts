import SubdireccionesModel, { ISubdireciones } from "../models/Subdireciones";
class BussinesSubdir {
    public async readSub(): Promise<Array<ISubdireciones>>;
    public async readSub(id: string): Promise<ISubdireciones>;
    public async readSub(query: any, skip: number, limit: number): Promise<Array<ISubdireciones>>;

    public async readSub(params1?: string | any, params2?: number, params3?: number): Promise<Array<ISubdireciones> | ISubdireciones> {
        if (params1 && typeof params1 == "string") {
            var result: ISubdireciones = await SubdireccionesModel.findOne({ nombresubdir: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listUser: Array<ISubdireciones> = await SubdireccionesModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } else {
            let listUser: Array<ISubdireciones> = await SubdireccionesModel.find();
            return listUser;

        }
    }
    public async addSubdir(subdir: ISubdireciones) {
        try {
            let subdirDb = new SubdireccionesModel(subdir);
            let result = await subdirDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
   /* public async getListSubdir() {
        let result = await SubdireccionesModel.find();
        return result;
    }*/
    public async updateSubdi(id: string, subdir: any) {

        let result = await SubdireccionesModel.updateOne({ _id: id }, { $set: subdir });
        return result;
    }
    public async deleteSubdir(id: String) {
        let result = await SubdireccionesModel.remove({ _id: id });
        ////----------////
        return result;
    }

}
export default BussinesSubdir;