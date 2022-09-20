import SlaiderModule, {ISlaider} from "../models/slaider";

class BussSlaider{
    constructor(){

    }
    public async readSlaider(): Promise<Array<ISlaider>>;
    public async readSlaider(id: string): Promise<ISlaider>;
    public async readSlaider(query: any, skip: number, limit: number): Promise<Array<ISlaider>>;

    public async readSlaider(params1?: string | any, params2?: number, params3?: number): Promise<Array<ISlaider> | ISlaider> {
        if (params1 && typeof params1 == "string") {
            var result: ISlaider = await SlaiderModule.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listSlaider: Array<ISlaider> = await SlaiderModule.find(params1).skip(skip).limit(limit);
            return listSlaider;
        } else {
            let listSlaider: Array<ISlaider> = await SlaiderModule.find();
            return listSlaider;
        }
    }  
    public async readSlider(img: string): Promise<ISlaider>;
    public async readSlider(params1?: string | any, params2?: number, params3?: number): Promise<Array<ISlaider> | ISlaider> {
        if (params1 && typeof params1 == "string") {
            var result: ISlaider = await SlaiderModule.findOne({ img: params1 });
            return result;
        }
    } 
    public async readSliders(query?: any): Promise<Array<ISlaider>>;
    public async readSliders(search: string | any, params2?: number, params3?: number) {
        var filter = {
            "$or": [
                { "estado": { "$regex": search, "$options": "i" } },
            ]
        };
        let skip = params2 ? params2 : 0;
        let limit = params3 ? params3 : 100;
        let listSlider: Array<ISlaider> = await SlaiderModule.find(filter).skip(skip).limit(limit).sort({ '_id': 1 });
        return listSlider;

    } 
    public async addSlaider(slaider: ISlaider) {
        try {
            let convenioDb = new SlaiderModule(slaider);
            let result = await convenioDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateSlaider(id: string, slaider: any) {
        let result = await SlaiderModule.update({ _id: id }, { $set: slaider });
        return result;
    }
    public async deleteSlaider(id: string) {
        let result = await SlaiderModule.remove({ _id: id });
        return result;
    }
}
export default BussSlaider;