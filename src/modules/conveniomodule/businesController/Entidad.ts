import EntidadModel, { IEntidad } from './../models/Entidad';

class BussEntidad{
    constructor(){

    }
    public async readEntidad(): Promise<Array<IEntidad>>;
    public async readEntidad(id: string): Promise<IEntidad>;
    public async readEntidad(query: any, skip: number, limit: number): Promise<Array<IEntidad>>;

    public async readEntidad(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEntidad> | IEntidad> {
        if (params1 && typeof params1 == "string") {
            var result: IEntidad = await EntidadModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listEntidad: Array<IEntidad> = await EntidadModel.find(params1).skip(skip).limit(limit);
            return listEntidad;
        } else {
            let listEntidad: Array<IEntidad> = await EntidadModel.find().populate('representante');
            return listEntidad;
        }
    }  
    public async readUser(post: string): Promise<IEntidad>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEntidad> | IEntidad> {
        if (params1 && typeof params1 == "string") {
            var result: IEntidad = await EntidadModel.findOne({ post: params1 });
            return result;
        }
    } 
    public async addEntidad(entidad: IEntidad) {
        try {
            let entidadDb = new EntidadModel(entidad);
            let result = await entidadDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateEntidad(id: string, entidad: any) {
        let result = await EntidadModel.update({ _id: id }, { $set: entidad });
        return result;
    }
    public async deleteEntidad(id: string) {
        let result = await EntidadModel.remove({ _id: id });
        return result;
    }

}
export default BussEntidad;