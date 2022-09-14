
import DesembolsoModel, {IDesembolso} from "../models/desembolso";

class BussDesem{
    constructor(){

    }
    public async readDesem(): Promise<Array<IDesembolso>>;
    public async readDesem(id: string): Promise<IDesembolso>;
    public async readDesem(query: any, skip: number, limit: number): Promise<Array<IDesembolso>>;

    public async readDesem(params1?: string | any, params2?: number, params3?: number): Promise<Array<IDesembolso> | IDesembolso> {
        if (params1 && typeof params1 == "string") {
            var result: IDesembolso = await DesembolsoModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listDesem: Array<IDesembolso> = await DesembolsoModel.find(params1).skip(skip).limit(limit);
            return listDesem;
        } else {
            let listDesem: Array<IDesembolso> = await DesembolsoModel.find();
            return listDesem;
        }
    }  
    public async readUser(post: string): Promise<IDesembolso>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IDesembolso> | IDesembolso> {
        if (params1 && typeof params1 == "string") {
            var result: IDesembolso = await DesembolsoModel.findOne({ post: params1 });
            return result;
        }
    } 
    public async addDesem(desem: IDesembolso) {
        try {
            let desemDb = new DesembolsoModel(desem);
            let result = await desemDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateDesem(id: string, desem: any) {
        let result = await DesembolsoModel.update({ _id: id }, { $set: desem });
        return result;
    }
    public async deleteDesem(id: string) {
        let result = await DesembolsoModel.remove({ _id: id });
        return result;
    }

}
export default BussDesem;