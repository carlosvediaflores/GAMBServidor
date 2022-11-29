import RepresentanteModel, { IRepresentante } from './../models/Representante';

class BussRepres{
    constructor(){

    }
    public async readRepres(): Promise<Array<IRepresentante>>;
    public async readRepres(id: string): Promise<IRepresentante>;
    public async readRepres(query: any, skip: number, limit: number): Promise<Array<IRepresentante>>;

    public async readRepres(params1?: string | any, params2?: number, params3?: number): Promise<Array<IRepresentante> | IRepresentante> {
        if (params1 && typeof params1 == "string") {
            var result: IRepresentante = await RepresentanteModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listRepres: Array<IRepresentante> = await RepresentanteModel.find(params1).skip(skip).limit(limit);
            return listRepres;
        } else {
            let listRepres: Array<IRepresentante> = await RepresentanteModel.find().populate("identi");
            return listRepres;
        }
    }  
    public async readUser(post: string): Promise<IRepresentante>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IRepresentante> | IRepresentante> {
        if (params1 && typeof params1 == "string") {
            var result: IRepresentante = await RepresentanteModel.findOne({ post: params1 });
            return result;
        }
    } 
    public async addRepres(repres: IRepresentante) {
        try {
            let represDb = new RepresentanteModel(repres);
            let result = await represDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateRepres(id: string, repres: any) {
        let result = await RepresentanteModel.update({ _id: id }, { $set: repres });
        return result;
    }
    public async deleteRepres(id: string) {
        let result = await RepresentanteModel.remove({ _id: id });
        return result;
    }
}
export default BussRepres;