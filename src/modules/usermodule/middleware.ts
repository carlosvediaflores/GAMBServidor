import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import BusinessUser from "./businessController/BusinessUser";
import { IUser } from "./models/Users";
import { IRoles } from "./models/Roles";


var jsonwebtokenSecurity = (request: Request, response: Response, next: NextFunction) => {

    var token: string = request.headers["authorization"];
    
    if (!token) {
        response.status(300).json({ serverResponse: "No tiene acceso a este endpoint" });
        return;
    }
    jsonwebtoken.verify(token, "secret", async (err, success: any) => {
        if (err) {
            response.status(300).json({ serverResponse: "Token no valido " + err.message });
            return;
        }
        var id = success.id;
        var user: BusinessUser = new BusinessUser();
        let userdata:any = await user.readUsers(id, );
        request.body["user"]=userdata;
        
       // console.log(request.body);
        
        if (!userdata) {
            response.status(300).json({ serverResponse: "No valido " });
            return;
        }
        if(userdata.roles=="SUPER_ADMIN" || userdata.roles=="ADMIN" || userdata.roles=="SUPER_USER" || userdata.roles=="SECRETARIA"){

            next();
            return;
        }
        /*  var roles: Array<IRoles> = userdata.roles;
        for (var i = 0; i < roles.length; i++) {
            if (
                request.url.toLowerCase().includes(roles[i].urn.toLowerCase()) &&
                request.method.toLowerCase().includes(roles[i].method.toLowerCase())) {
                    return;
                }
            } */
        response.status(300).json({ serverResponse: "Usted no cuenta con los permisos " });
    });
    
}
export default jsonwebtokenSecurity;