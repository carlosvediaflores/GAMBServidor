import entityModel, { IEntity } from "../models/entities";
import RepresentanteModel, { IRepresentante } from './../models/Representante';
class BussEntity {
    constructor() {

    }
    public async readEntity(): Promise<Array<IEntity>>;
    public async readEntity(id: string): Promise<IEntity>;
    public async readEntity(query: any, skip: number, limit: number, order: any): Promise<Array<IEntity>>;

    public async readEntity(params1?: string | any, params2?: number, params3?: number, order?: any): Promise<Array<IEntity> | IEntity> {
        if (params1 && typeof params1 == "string") {
            var result: IEntity = await entityModel.findOne({ _id: params1 }).populate('representante');
            return result;
        } else if (params1) {
            let skip = params2;
            let limit = params3;
            let listEntidad: Array<IEntity> = await entityModel.find(params1).skip(skip).limit(limit).sort(order).populate('representante');
            return listEntidad;
        } else {
            let listEntidad: Array<IEntity> = await entityModel.find().sort({ _id: -1 }).populate('representante');
            return listEntidad;
        }
    }
    public async readEntityCod(codigo: string | any): Promise<IEntity>;
    public async readEntityCod(params1?: string | any, params2?: number, params3?: number): Promise<Array<IEntity> | IEntity> {
        if (params1 && typeof params1 == "string") {
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
        let result = await entityModel.updateOne({ _id: id }, { $set: entidad });
        return result;
    }
    public async deleteEntity(id: string) {
        let result = await entityModel.remove({ _id: id });
        return result;
    }
    public async addRepres(idEnti: string, idRepres: string) {
            let enti = await entityModel.findOne({ _id: idEnti });
            if (enti != null) {
                var repres = await RepresentanteModel.findOne({ _id: idRepres });
                if (repres != null) {
                    var checksub: Array<IRepresentante> = enti.representante.filter((item) => {
                        if (repres._id.toString() == item._id.toString()) {
                            return true;
                        }
                        return false;
                    });
                    if (checksub.length == 0) {
                        enti.representante.push(repres);
                        return await enti.save();
                    }
                    return null;
                }
                return null;
            }
            return null;
        }

}
export default BussEntity;