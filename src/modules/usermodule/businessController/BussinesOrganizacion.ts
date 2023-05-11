import OrganizacionModel, { IOrganizacion } from "../models/Organizacion";
import SubdireccionesModel, { ISubdireciones } from "../models/Subdireciones";
class BussinesOrganizacion {  
    public async readOrgs(): Promise<Array<IOrganizacion>>;
    public async readOrgs(id: string): Promise<IOrganizacion>;
    public async readOrgs(query: any, skip: number, limit: number): Promise<Array<IOrganizacion>>;

    public async readOrgs(params1?: string | any, params2?: number, params3?: number): Promise<Array<IOrganizacion> | IOrganizacion> {
        if (params1 && typeof params1 == "string") {
            var result: IOrganizacion = await OrganizacionModel.findOne({ nombredir: params1 }).populate('subdirecciones');
            //var result: IOrganizacion = await OrganizacionModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listUser: Array<IOrganizacion> = await OrganizacionModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } 
        else {
            let listUser: Array<IOrganizacion> = await OrganizacionModel.find().populate('subdirecciones');
            return listUser;

        }
    }
    public async readOrg(): Promise<Array<IOrganizacion>>;
    public async readOrg(id: string): Promise<IOrganizacion>;
    public async readOrg(query: any, skip: number, limit: number): Promise<Array<IOrganizacion>>;

    public async readOrg(params1?: string | any, params2?: number, params3?: number): Promise<Array<IOrganizacion> | IOrganizacion> {
        if (params1 && typeof params1 == "string") {
            //var result: IOrganizacion = await OrganizacionModel.findOne({ nombredir: params1 });
            var result: IOrganizacion = await OrganizacionModel.findOne({ _id: params1 }).populate('subdirecciones');
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listUser: Array<IOrganizacion> = await OrganizacionModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } 
        else {
            let listUser: Array<IOrganizacion> = await OrganizacionModel.find();
            return listUser;

        }
    }
    public async addOrganizacion(organizacion: IOrganizacion) {
        try {
            let orgDb = new OrganizacionModel(organizacion);
            let result = await orgDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async addSub(idOr: string, idSub: string) {
        let org = await OrganizacionModel.findOne({ _id: idOr });
        if (org != null) {
            var sub = await SubdireccionesModel.findOne({ _id: idSub });
            if (sub != null) {
                var checksub: Array<ISubdireciones> = org.subdirecciones.filter((item) => {
                    if (sub._id.toString() == item._id.toString()) {
                        return true;
                    }
                    return false;
                });
                if (checksub.length == 0) {
                    org.subdirecciones.push(sub._id);
                    return await org.save();
                }
                return null;
            }
            return null;
        }
        return null;
    }
    public async addSubUni(idOr: string, organizacion: any) {
        let result = await OrganizacionModel.updateOne({ _id: idOr }, { $push: organizacion })
        return result;
    }
    public async removeSub(idOr: string, organizacion: any) {
        let result = await OrganizacionModel.updateOne({ _id: idOr }, { $pull: organizacion })
        return result;
    }
    public async updateOrg(id: string, organizacion: any) {

        let result = await OrganizacionModel.updateOne({ _id: id }, { $set: organizacion });
        return result;
    }
    public async deleteOrg(id: String) {
        let result = await OrganizacionModel.remove({ _id: id });
        ////----------////
        return result;
    }

}


export default BussinesOrganizacion;