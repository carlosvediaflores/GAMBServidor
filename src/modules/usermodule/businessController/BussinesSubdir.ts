import SubdireccionesModel, { ISubdireciones } from "../models/Subdireciones";
class BussinesSubdir {
    public async addSubdir(subdir: ISubdireciones) {
        try {
            let subdirDb = new SubdireccionesModel(subdir);
            let result = await subdirDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async getListSubdir() {
        let result = await SubdireccionesModel.find();
        return result;
    }
    public async updateSubdi(id: string, subdir: any) {

        let result = await SubdireccionesModel.update({ _id: id }, { $set: subdir });
        return result;
    }
    public async deleteSubdir(id: String) {
        let result = await SubdireccionesModel.remove({ _id: id });
        ////----------////
        return result;
    }

}
export default BussinesSubdir;