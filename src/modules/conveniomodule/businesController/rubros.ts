import rubroModel,{IRubros} from "../models/rubros";
class BussRubro{
    constructor(){

    }
    public async readRubro(): Promise<Array<IRubros>>;
    public async readRubro(id: string): Promise<IRubros>;
    public async readRubro(query: any, skip: number, limit: number): Promise<Array<IRubros>>;

    public async readRubro(params1?: string | any, params2?: number, params3?: number): Promise<Array<IRubros> | IRubros> {
        if (params1 && typeof params1 == "string") {
            var result: IRubros = await rubroModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listRubro: Array<IRubros> = await rubroModel.find(params1).skip(skip).limit(limit);
            return listRubro;
        } else {
            let listRubro: Array<IRubros> = await rubroModel.find();
            return listRubro;
        }
    }  
    public async readRubroCod(codigo: number): Promise<IRubros>;
    public async readRubroCod(params1?: number | any, params2?: number, params3?: number): Promise<Array<IRubros> | IRubros> {
        if (params1) {
            var result: IRubros = await rubroModel.findOne({ codigo: params1 });
            return result;
        }
    } 
    public async addRubro(rubro: IRubros) {
        try {
            let partidaDb = new rubroModel(rubro);
            let result = await partidaDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateRubro(id: string, rubro: any) {
        let result = await rubroModel.updateOne({ _id: id }, { $set: rubro });
        return result;
    }
    public async deleteRubro(id: string) {
        let result = await rubroModel.remove({ _id: id });
        return result;
    }

}
export default BussRubro;