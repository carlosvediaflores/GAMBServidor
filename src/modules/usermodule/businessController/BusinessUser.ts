import UsersModel, { IUser } from "../models/Users";
import RolesModel, { IRoles } from "../models/Roles";
class BusinessUser {
    constructor() {

    }
    /**
     * OverLoad
     * 
     * **/
    public async readUsers(): Promise<Array<IUser>>;
    public async readUsers(id: string): Promise<IUser>;
    public async readUsers(query: any, skip: number, limit: number): Promise<Array<IUser>>;

    public async readUsers(params1?: string | any, params2?: number, params3?: number): Promise<Array<IUser> | IUser> {
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listUser: Array<IUser> = await UsersModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } else {
            let listUser: Array<IUser> = await UsersModel.find();
            return listUser;

        }
    }
    //addUsers
    //CRUD
 
    public async addUsers(user: IUser) {
        try {
            let userDb = new UsersModel(user);
            let result = await userDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }

    public async updateUsers(id: string, user: any) {

        let result = await UsersModel.update({ _id: id }, { $set: user });
        return result;
    }
    public async deleteUsers(id: string) {
        let result = await UsersModel.remove({ _id: id });
        return result;
    }
    public async addRol(idUs: string, idRol: string) {
        let user = await UsersModel.findOne({ _id: idUs });
        if (user != null) {
            var rol = await RolesModel.findOne({ _id: idRol });
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
        let user = await UsersModel.findOne({ _id: idUs });
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
    }
}
export default BusinessUser;