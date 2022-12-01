import entityModel,{IEntity} from "../models/entities";
class BussEntity{
    constructor(){

    }
    public async readEntity(): Promise<Array<IEntity>>;
    public async readEntity(id: string): Promise<IEntity>;
    public async readEntity(query: any, skip: number, limit: number): Promise<Array<IEntity>>;

    public async readEntity(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEntity> | IEntity> {
        if (params1 && typeof params1 == "string") {
            var result: IEntity = await entityModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listEntidad: Array<IEntity> = await entityModel.find(params1).skip(skip).limit(limit);
            return listEntidad;
        } else {
            let listEntidad: Array<IEntity> = await entityModel.find();
            return listEntidad;
        }
    }  
    public async readEntityCod(codigo: number): Promise<IEntity>;
    public async readEntityCod(params1?: number | any, params2?: number, params3?: number): Promise<Array<IEntity> | IEntity> {
        if (params1) {
            var result: IEntity = await entityModel.findOne({ codigo: params1 });
            return result;
        }
    } 
    public async addEntity(entidad: IEntity) {
        try {
            let entidadDb = new entityModel(entidad);
            let result = await entidadDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateEntity(id: string, entidad: any) {
        let result = await entityModel.update({ _id: id }, { $set: entidad });
        return result;
    }
    public async deleteEntity(id: string) {
        let result = await entityModel.remove({ _id: id });
        return result;
    }

}
export default BussEntity;