import FileModel, { IFiles } from "../models/Files";
class BussinesFile {
    public async readFile(): Promise<Array<IFiles>>;
    public async readFile(id: string): Promise<IFiles>;
    public async readFile(query: any, skip: number, limit: number): Promise<Array<IFiles>>;

    public async readFile(params1?: string | any, params2?: number, params3?: number): Promise<Array<IFiles> | IFiles> {
        if (params1 && typeof params1 == "string") {
            var result: IFiles = await FileModel.findOne({ namefile: params1});
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listSegui: Array<IFiles> = await FileModel.find(params1).skip(skip).limit(limit);
            return listSegui;
        } else {
            let listSegui: Array<IFiles> = await FileModel.find().sort({'_id':-1});
            return listSegui;

        }
    }
    public async addFile(file: IFiles) {
        try {
            let fileDb = new FileModel(file);
            let result = await fileDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
   /* public async getListSubdir() {
        let result = await SubdireccionesModel.find();
        return result;
    }*/
    
    public async updateSegui(id: string, segui: IFiles) {

        let result = await FileModel.updateOne({ _id: id }, { $set: segui });
        return result;
    }
    
    public async deleteSegui(id: String) {
        let result = await FileModel.remove({ _id: id });
        ////----------////
        return result;
    }
}
export default BussinesFile;