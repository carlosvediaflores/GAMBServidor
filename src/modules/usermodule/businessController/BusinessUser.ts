import { query } from 'express';

import UsersModel, { IUser} from "../models/Users";
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
    public async readUsers(query?: any,limit?: number, skip?: number, order?:any): Promise<Array<IUser>>;

    public async readUsers(params1?: string | any, params2?: number, params3?: number, order?:any): Promise<Array<IUser> | IUser> {
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({ _id: params1 })
            .populate({
                path: "cargo",
                model: "Subdirecciones",
                populate: {
                  path: "unidad",
                  model: "Organizacion",
                },
              });
            return result;
            
        } else if (params1) {
            let skip = params3;
            let limit = params2;
            let result: Array<IUser> = await UsersModel.find(params1).limit(limit).skip(skip).sort(order);
            return result;
        } else {
            let listUser: Array<IUser> = await UsersModel.find({},{ password:0});
            return listUser;
        }
    }
    public async total(query: any): Promise<any>;

    public async total(params1?: string | any) {
        let listSegui = await UsersModel.countDocuments(params1);
        return listSegui;
     }    
    public async loginUsers(query?: any, skip?: number, limit?: number): Promise<Array<IUser>>;
    public async loginUsers(params1?: string | any, params2?: number, params3?: number): Promise<Array<IUser> | IUser> {
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listUser: Array<IUser> = await UsersModel.find(params1).skip(skip).limit(limit);
            return listUser;
        } else {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 10;
            let listUser: Array<IUser> = await UsersModel.find().skip(skip).limit(limit);
            return listUser;
        }
    }  
    public async readUser(post: string): Promise<IUser>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IUser> | IUser> {
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({ post: params1 });
            return result;
        }
    }
    public async addUsers(user: IUser) {
        try {
            let userDb = new UsersModel(user);
            let result = await userDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }

    public async updateUser(id: string, user: any) {

        let result = await UsersModel.updateOne({ _id: id }, { $set: user });
        return result;
    }
    public async deleteUsers(id: string) {
        let result = await UsersModel.deleteOne({ _id: id });
        return result;
    }
    public async getUserSurnames(surnames: string) {   
        console.log(surnames);
        
        let result = await UsersModel.findOne({surnames:surnames})
        .populate("cargo")
        return result;
      }
}
export default BusinessUser;
