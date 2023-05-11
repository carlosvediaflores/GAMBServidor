
import DesembolsoModel, {ITransferencia} from "../models/transferencia";

class BussDesem{
    constructor(){

    }
    public async readDesem(): Promise<Array<ITransferencia>>;
    public async readDesem(id: string): Promise<ITransferencia>;
    public async readDesem(query: any, skip: number, limit: number): Promise<Array<ITransferencia>>;

    public async readDesem(params1?: string | any, params2?: number, params3?: number): Promise<Array<ITransferencia> | ITransferencia> {
        if (params1 && typeof params1 == "string") {
            var result: ITransferencia = await DesembolsoModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listDesem: Array<ITransferencia> = await DesembolsoModel.find(params1).skip(skip).limit(limit);
            return listDesem;
        } else {
            let listDesem: Array<ITransferencia> = await DesembolsoModel.find().populate({
                path: "idcv",
                model: "cvconvenio",
                populate: { path: "files", model: "cvfiles"},
              })
              .populate({
                path: "idcv",
                model: "cvconvenio",
                populate: { path:"transferencia",model:"cvtransferencia"},
              })
            return listDesem;
        }
    }  
    public async readUser(post: string): Promise<ITransferencia>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<ITransferencia> | ITransferencia> {
        if (params1 && typeof params1 == "string") {
            var result: ITransferencia = await DesembolsoModel.findOne({ post: params1 });
            return result;
        }
    }
    public async readtranf(namefile: string): Promise<ITransferencia>;
    public async readtranf(params1?: string | any, params2?: number, params3?: number): Promise<Array<ITransferencia> | ITransferencia> {
        if (params1 && typeof params1 == "string") {
            var result: ITransferencia = await DesembolsoModel.findOne({ namefile: params1 });
            return result;
        }
    } 
    public async addDesem(desem: ITransferencia) {
        try {
            let desemDb = new DesembolsoModel(desem);
            let result = await desemDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateDesem(id: string, desem: any) {
        let result = await DesembolsoModel.updateOne({ _id: id }, { $set: desem });
        return result;
    }
    public async deleteDesem(id: string) {
        let result = await DesembolsoModel.remove({ _id: id });
        return result;
    }
}
export default BussDesem;