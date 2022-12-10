import gacetaModule, { IGaceta } from "../models/gaceta";

class BussGaceta{
    constructor(){

    }
    public async readGaceta(): Promise<Array<IGaceta>>;
    public async readGaceta(id: string): Promise<IGaceta>;
    public async readGaceta(query: any, skip: number, limit: number, order:any): Promise<Array<IGaceta>>;

    public async readGaceta(params1?: string | any, params2?: number, params3?: number, order?: any): Promise<Array<IGaceta> | IGaceta> {
        if (params1 && typeof params1 == "string") {
            var result: IGaceta = await gacetaModule.findOne({ _id: params1 }).populate("usuario");
            return result;
        } else if (params1) {
            let skip = params2;
            let limit = params3;
            let listGaceta: Array<IGaceta> = await gacetaModule.find(params1).skip(skip).limit(limit).sort(order).populate("usuario");
            return listGaceta;
        } else {
            let listGaceta: Array<IGaceta> = await gacetaModule.find().populate("usuario");
            return listGaceta;
        }
    }  
    public async total({}) {
        var result = await gacetaModule.count();
        return result;
      }
    public async readPost(file: string): Promise<IGaceta>;
    public async readPost(params1?: string | any, params2?: number, params3?: number): Promise<Array<IGaceta> | IGaceta> {
        if (params1 && typeof params1 == "string") {
            var result: IGaceta = await gacetaModule.findOne({ file: params1 });
            return result;
        }
    } 
    public async addGaceta(Gaceta: IGaceta) {
        try {
            let GacetaDb = new gacetaModule(Gaceta);
            let result = await GacetaDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateGaceta(id: string, Gaceta: any) {
        let result = await gacetaModule.update({ _id: id }, { $set: Gaceta });
        return result;
    }
    public async deleteGaceta(id: string) {
        let result = await gacetaModule.remove({ _id: id });
        return result;
    }
}
export default BussGaceta;