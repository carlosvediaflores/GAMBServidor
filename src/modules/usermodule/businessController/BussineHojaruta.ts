import HojaModel, { IHojaruta } from './../models/Hojaruta';
import SeguientoModel, {ISeguimiento} from './../models/Seguimiento';
class BusinessHoja {
    public async readHoja(): Promise<Array<IHojaruta>>;
    public async readHoja(id: string): Promise<IHojaruta>;
    public async readHoja(query: any, skip: number, limit: number): Promise<Array<IHojaruta>>;

    public async readHoja(params1?: string | any, params2?: number, params3?: number): Promise<Array<IHojaruta> | IHojaruta> {
        if (params1 && typeof params1 == "string") {
            var result: IHojaruta = await HojaModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listHoja: Array<IHojaruta> = await HojaModel.find(params1).skip(skip).limit(limit);
            return listHoja;
        } else {
            let listHoja: Array<IHojaruta> = await HojaModel.find();
            return listHoja;

        }
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
    /*public async addRol(idUs: string, idRol: string) {
        let user = await HojaModel.findOne({ _id: idUs });
        if (user != null) {
            var rol = await HojaModel.findOne({ _id: idRol });
            if (rol != null) {
                var checkrol: Array<IRoles> = user.roles.filter((item) => {
                    if (rol._id.toString() == item._id.toString()) {
                        return true;
                    }
                    return false;
                });
                console.log(checkrol)
                if (checkrol.length == 0) {
                    user.roles.push(rol);
                    return await user.save();
                }
                return null;
            }
            return null;
        }
        return null;
    }
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