import EsadoMonto, { IEstmonto } from "../models/estadomonto";

class BussEstadoMonto{
    constructor(){

    }
    public async readEstmonto(): Promise<Array<IEstmonto>>;
    public async readEstmonto(id: string): Promise<IEstmonto>;
    public async readEstmonto(query: any, skip: number, limit: number): Promise<Array<IEstmonto>>;

    public async readEstmonto(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEstmonto> | IEstmonto> {
        if (params1 && typeof params1 == "string") {
            var result: IEstmonto = await EsadoMonto.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listEstmonto: Array<IEstmonto> = await EsadoMonto.find(params1).skip(skip).limit(limit);
            return listEstmonto;
        } else {
            let listEstmonto: Array<IEstmonto> = await EsadoMonto.find();
            return listEstmonto;
        }
    }  
    public async readUser(post: string): Promise<IEstmonto>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEstmonto> | IEstmonto> {
        if (params1 && typeof params1 == "string") {
            var result: IEstmonto = await EsadoMonto.findOne({ post: params1 });
            return result;
        }
    } 
    public async addEstmonto(estmonto: IEstmonto) {
        try {
            let entidadDb = new EsadoMonto(estmonto);
            let result = await entidadDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateEstmonto(id: string, estmonto: any) {
        let result = await EsadoMonto.updateOne({ _id: id }, { $set: estmonto });
        return result;
    }
    public async deleteEstmonto(id: string) {
        let result = await EsadoMonto.deleteOne({ _id: id });
        return result;
    }
}
export default BussEstadoMonto;