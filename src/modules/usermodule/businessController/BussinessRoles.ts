import RolesModel, { IRoles } from "../models/Roles";
class BussinessRoles {
    constructor() {
    }
    public async createRol(rol: IRoles) {
        try {
            let roles = new RolesModel(rol);
            let result = await roles.save();
            return result;
        } catch (error) {
            return null;
        }
    }
    public async deleteRol(id: String) {
        let result = await RolesModel.remove({ _id: id });
        ////----------////
        return result;
    }
    public async getListRol() {
        let result = await RolesModel.find();
        return result;
    }
}
export default BussinessRoles;