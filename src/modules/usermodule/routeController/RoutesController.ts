import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import BussinessRoles from "../businessController/BussinessRoles";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import Users, { ISimpleUser, IUser } from "../models/Users";
import isEmpty from "is-empty";
import path from "path";
interface Icredentials {
  email: string;
  password: string;
}
class RoutesController {
  constructor() { }
  public async login(request: Request, response: Response) {
    var credentials: Icredentials = request.body;
    if (credentials.email == undefined) {
      response
        .status(300)
        .json({ serverResponse: "Es necesario el parámetro de email" });
      return;
    }
    if (credentials.password == undefined) {
      response
        .status(300)
        .json({ serverResponse: "Es necesario el parámetro de password" });
      return;
    }
    credentials.password = sha1(credentials.password);
    const user: BusinessUser = new BusinessUser();
    let result: Array<IUser> = await user.readUsers(credentials, 0, 1);
    if (result.length == 1) {
      var loginUser: IUser = result[0];
      var token: string = jsonwebtoken.sign(
        { id: loginUser._id, email: loginUser.email },
        "secret"
      );
      response.status(200).json( {
         email: loginUser.email,
         username: loginUser.username,
          token,
      });
      return;
    }
    response.status(200).json({ serverResponse: "Credenciales incorrectas" });
  }
  public async createUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();

    var userData = request.body;
    if (userData["password"] == null) {
      response.status(200).json({ serverResponse: { error: "Paramétros Incorrectos" } })
      return;
    }
    userData["registerdate"] = new Date();
    userData["password"] = sha1(userData["password"]);
    let result = await user.addUsers(userData);
    response.status(201).json({ serverResponse: result });
  }
  public async getUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    const result: Array<IUser> = await user.readUsers();
    response.status(200).json( result );
  }
  public async getUser(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    let res = await user.readUsers(request.params.id);
    //const result: Array<IUser> = await user.readUsers();
    response.status(200).json( res );
  }
  /*
  public async getUserss(request: Request, response: Response) {

    try {
        let producto = await Users.findById(request.params.id);

        if(!producto) {
            request.status(404).json({ msg: 'No existe el producto' })
        }
       
        response.json(producto);
        
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
  }
  */
  public async updateUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    var params = request.body;
    if (params["password"] != null) {
      params["password"] = sha1(params["password"]);
    }
    var result = await user.updateUsers(id, params);
    response.status(200).json(result);
  }
  public async removeUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    let result = await user.deleteUsers(id);
    response.status(200).json({ serverResponse: result });
  }
  public async addRol(request: Request, response: Response) {
    let idUs: string = request.params.id;
    let idRol = request.body.idRol;
    if (idUs == null && idRol == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del rol",
      });
      return;
    }
    var user: BusinessUser = new BusinessUser();
    var result = await user.addRol(idUs, idRol);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol o usuario no existen, o esta asignando dolble rol" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }
  public async createRol(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    var rolesData: any = request.body;
    let result = await roles.createRol(rolesData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async removeRol(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    let idRol: string = request.params.id;
    let result = await roles.deleteRol(idRol);
    response.status(201).json({ serverResponse: result });
  }
  public async getRoles(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    let result = await roles.getListRol();
    response.status(200).json({ serverResponse: result });
  }
  public async removeUserRol(request: Request, response: Response) {
    let roles: BusinessUser = new BusinessUser();
    let idUs: string = request.params.id;
    let idRol: string = request.body.idRol;
    let result = await roles.removeRol(idUs, idRol);
    response.status(200).json({ serverResponse: result });
  }

  public async uploadPortrait(request: Request, response: Response) {
    var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para subir una foto" });
      return;
    }
    var user: BusinessUser = new BusinessUser();
    var userToUpdate: IUser = await user.readUsers(id);
    if (!userToUpdate) {
      response.status(300).json({ serverResponse: "El usuario no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../avatarfiles`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;
    /*var file: any = files.portrait;
    if (!file) {
      response.status(300).json({
        serverResponse:
          "error el archivo debe ser subido con el parametro portrait!",
      });
      return;
    }*/
    var key: Array<string> = Object.keys(files);
    /**/
    var copyDirectory = (totalpath: string, file: any) => {
      return new Promise((resolve, reject) => {
        file.mv(totalpath, (err: any, success: any) => {
          if (err) {
            resolve(false);
            return;
          }
          resolve(true);
          return;
        });
      });
    };
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 7);
      var newname: string = `${filehash}_${file.name}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      userToUpdate.uriavatar = "/api/getportrait/" + id;
      userToUpdate.pathavatar = totalpath;
      var userResult: IUser = await userToUpdate.save();
    }
    var simpleUser: ISimpleUser = {
      username: userResult.username,
      uriavatar: userResult.uriavatar,
      pathavatar: userResult.pathavatar,
    };
    response.status(300).json({ serverResponse: simpleUser });
    /*file.mv(totalpath, async (err: any, success: any) => {
      if (err) {
        response
          .status(300)
          .json({ serverResponse: "No se pudo almacenar el archivo" });
        return;
      }

      userToUpdate.uriavatar = "/api/getportrait/" + id;
      userToUpdate.pathavatar = totalpath;
      var userResult: IUser = await userToUpdate.save();
      var simpleUser: ISimpleUser = {
        username: userResult.username,
        uriavatar: userResult.uriavatar,
        pathavatar: userResult.pathavatar,
      };
      response.status(300).json({ serverResponse: simpleUser });
    });*/
  }

  public async getPortrait(request: Request, response: Response) {
    var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var user: BusinessUser = new BusinessUser();
    var userData: IUser = await user.readUsers(id);
    if (!userData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (userData.pathavatar == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(userData.pathavatar);
  }
}
export default RoutesController;
