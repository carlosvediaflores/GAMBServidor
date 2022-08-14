import SeguiModel, { ISeguimiento } from "../models/Seguimiento";
class BussinesSegui {
    public async readSegui(): Promise<Array<ISeguimiento>>;
    public async readSegui(id: string): Promise<ISeguimiento>;
    public async readSegui(query: any, skip: number, limit: number): Promise<Array<ISeguimiento>>;

    public async readSegui(params1?: string | any, params2?: number, params3?: number): Promise<Array<ISeguimiento> | ISeguimiento> {
        if (params1 && typeof params1 == "string") {
            var result: ISeguimiento = await SeguiModel.findOne({ _id: params1});
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listSegui: Array<ISeguimiento> = await SeguiModel.find(params1).skip(skip).limit(limit);
            return listSegui;
        } else {
            let listSegui: Array<ISeguimiento> = await SeguiModel.find();
            return listSegui;

        }
    }
    public async readSeguis(): Promise<Array<ISeguimiento>>;
    public async readSeguis(id: string): Promise<ISeguimiento>;
    public async readSeguis(query: any, skip: number, limit: number): Promise<Array<ISeguimiento>>;

    public async readSeguis(params1?: string | any, params2?: number, params3?: number): Promise<Array<ISeguimiento> | ISeguimiento> {
        if (params1 && typeof params1 == "string") {
            var result: ISeguimiento = await SeguiModel.findOne({ idhj: params1 }).sort({ '_id': -1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listSegui: Array<ISeguimiento> = await SeguiModel.find(params1).skip(skip).limit(limit);
            return listSegui;
        } else {
            let listSegui: Array<ISeguimiento> = await SeguiModel.find();
            return listSegui;

        }
    }
   
    public async readSeguiO(query?: any): Promise<Array<ISeguimiento>>;
    public async readSeguiO(params1?: string | any): Promise<Array<ISeguimiento> | ISeguimiento> {
        var filter = {
            "$or": [
                { "destino": { "$regex": params1, "$options": "i" } },
                //Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
            ]
        };
        
        let listSeguiO: Array<ISeguimiento> = await SeguiModel.find(filter).sort({ 'nuit': -1 });
        return listSeguiO;
    }
    public async readSeguiAs(query?: any): Promise<Array<ISeguimiento>>;
    public async readSeguiAs(params1?: string | any): Promise<Array<ISeguimiento> | ISeguimiento> {
        var filter = {
            "$or": [
                { "nuit": { "$regex": params1, "$options": "i" } },
                //Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
            ]
        };
        
        let listSeguiO: Array<ISeguimiento> = await SeguiModel.find(filter).sort({ '_id': 1 });
        return listSeguiO;
    }
    
    public async addSegui(segui: ISeguimiento) {
        try {
            let seguiDb = new SeguiModel(segui);
            let result = await seguiDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
   /* public async getListSubdir() {
        let result = await SubdireccionesModel.find();
        return result;
    }*/
    
    public async updateSegui(id: string, segui: ISeguimiento) {

        let result = await SeguiModel.update({ _id: id }, { $set: segui });
        return result;
    }
    public async updateSeguiAs(nuit: string, segui: ISeguimiento) {

        let result = await SeguiModel.updateMany({ nuit: nuit }, { $set: segui });
        return result;
    }
    
    public async deleteSegui(id: String) {
        let result = await SeguiModel.remove({ _id: id });
        ////----------////
        return result;
    }

}
export default BussinesSegui;