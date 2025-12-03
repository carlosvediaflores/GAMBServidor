import EntidadModel, { IEntidad } from './../models/Entidad';
import RepresentanteModel, { IRepresentante } from './../models/Representante';
class BussEntidad {
    constructor() {

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
            let listEntidad: Array<IEntidad> = await EntidadModel.find().populate('representante').sort({ _id: -1 });
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
        let result = await EntidadModel.updateOne({ _id: id }, { $set: entidad });
        return result;
    }
    public async deleteEntidad(id: string) {
        let result = await EntidadModel.remove({ _id: id });
        return result;
    }
    public async addRepres(idEnti: string, idRepres: string) {
        let enti = await EntidadModel.findOne({ _id: idEnti });
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
export default BussEntidad;