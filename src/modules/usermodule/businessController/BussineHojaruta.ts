import FileModel, { IFiles } from './../models/Files';
import { query } from 'express';
import HojaModel, { IHojaruta } from './../models/Hojaruta';
import SeguientoModel, { ISeguimiento } from './../models/Seguimiento';
class BusinessHoja {
    public async readHoja(): Promise<Array<IHojaruta>>;
    public async readHoja(id: string): Promise<IHojaruta>;
    public async readHoja(nuit: number): Promise<IHojaruta>;
    public async readHoja(query: any, skip: number, limit: number): Promise<Array<IHojaruta>>;
    public async readHoja(params1?: string | any, params2?: number, params3?: number): Promise<Array<IHojaruta> | IHojaruta> {
        if (params1 && typeof params1 == "string") {
            var result: IHojaruta = await HojaModel.findOne({ _id: params1 });
            return result;

        } else if (params1) {
            var result: IHojaruta = await HojaModel.findOne({ nuit: params1 });
            return result;
        } else {
            let listHoja: Array<IHojaruta> = await HojaModel.find().sort({ '_id': -1 });
            return listHoja;

        }
    }
    public async search(query?: any): Promise<Array<IHojaruta>>;
    public async search(search: string | any, params2?: number, params3?: number) {
        var filter = {
            "$or": [
                { "nuit": { "$regex": search, "$options": "i" } },
                { "origen": { "$regex": search, "$options": "i" } },
                { "referencia": { "$regex": search, "$options": "i" } }
                
                //Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
            ]
        };
        let skip = params2 ? params2 : 0;
        let limit = params3 ? params3 : 100;
        let listHoja: Array<IHojaruta> = await HojaModel.find(filter).skip(skip).limit(limit);
        return listHoja;

    }
    public async addHoja(hoja: IHojaruta) {
        try {
            let userDb = new HojaModel(hoja);
            let result = await userDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async addSeguim(idRuta: string, idSegui: string) {
        let ruta = await HojaModel.findOne({ _id: idRuta });
        if (ruta != null) {
            var segui = await SeguientoModel.findOne({ _id: idSegui });
            if (segui != null) {
                var checksub: Array<ISeguimiento> = ruta.seguimiento.filter((item) => {
                    if (segui._id.toString() == item._id.toString()) {
                        return true;
                    }
                    return false;
                });
                console.log(checksub)
                if (checksub.length == 0) {
                    ruta.seguimiento.push(segui);
                    return await ruta.save();
                }
                return null;
            }
            return null;
        }
        return null;
    }

    public async updateHojas(id: string, hoja: any) {

        let result = await HojaModel.update({ _id: id }, { $set: hoja });
        return result;
    }
    public async deleteHojas(id: string) {
        let result = await HojaModel.remove({ _id: id });
        return result;
    }
   public async addFiles(idruta: string, idFile: string) {
        let ruta = await HojaModel.findOne({ _id: idruta });
        if (ruta != null) {
            var fil = await FileModel.findOne({ _id: idFile });
            if (fil != null) {
                var checkrol: Array<IFiles> = ruta.archivo.filter((item) => {
                    if (fil._id.toString() == item._id.toString()) {
                        return true;
                    }
                    return false;
                });
                console.log(checkrol)
                if (checkrol.length == 0) {
                    ruta.archivo.push(fil);
                    return await ruta.save();
                }
                return null;
            }
            return null;
        }
        return null;
    }
     /*
    public async removeRol(idUs: string, idRol: string) {
        let user = await ModelHoja.findOne({ _id: idUs });
        var rol = await RolesModel.findOne({ _id: idRol });
        if (user != null && rol != null) {
            let newroles: Array<IRoles> = user.roles.filter((item: IRoles) => {
                if (item.name == rol.name) {
                    return false;
                }
                return true;
            });
            user.roles = newroles;
            try {
                return await user.save();
            } catch (err) {
                return err;
            };

        }
        return null
    }*/
}
export default BusinessHoja;