import { IFiles } from "./../models/Files";
import { IHojaruta, ISimpleHojaruta } from "./../models/Hojaruta";
import { IOrganizacion } from "./../models/Organizacion";

import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import BussinessRoles from "../businessController/BussinessRoles";
import BussinesOrganizacion from "../businessController/BussinesOrganizacion";
import BussinesSubdir from "../businessController/BussinesSubdir";
import BussinesSegui from "../businessController/BussinesSegui";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import Users, { ISimpleUser, IUser } from "../models/Users";
import isEmpty from "is-empty";
import path from "path";
import BusinessHoja from "../businessController/BussineHojaruta";
import { ISeguimiento } from "../models/Seguimiento";
import BussinesFile from "../businessController/BussinesFlies";
interface Icredentials {
  email: string;
  password: string;
}
class RoutesController {
  constructor() {}
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
    let result: Array<IUser> = await user.loginUsers(credentials, 0, 1);
    if (result.length == 1) {
      var loginUser: IUser = result[0];
      var token: string = jsonwebtoken.sign(
        { id: loginUser._id, email: loginUser.email },
        "secret"
      );
      response.status(200).json({
        email: loginUser.email,
        username: loginUser.username,
        surnames: loginUser.surnames,
        post: loginUser.post,
        roles: loginUser.roles,
        token,
      });
      return;
    }
    response
      .status(200)
      .json({ serverResponse: "Credenciales incorrectas!!!" });
  }
  public async createUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();

    var userData = request.body;
    if (userData["password"] == null) {
      response
        .status(200)
        .json({ serverResponse: { error: "Paramétros Incorrectos" } });
      return;
    }
    userData["registerdate"] = new Date();
    userData["password"] = sha1(userData["password"]);
    let result = await user.addUsers(userData);
    response.status(201).json({ serverResponse: result });
  }
  public async getUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    const result1: Array<IUser> = await user.readUsers();
    var totalDocs = result1.length;
    var limit = parseInt(request.params.limit, 10) || 100;
    var page = parseInt(request.params.page, 10) || 0;
    var totalpage = Math.ceil(totalDocs / limit);
    var skip = limit * (page - 1);
    if (page == 1 || !page || page == undefined) {
      skip = 0;
    } else {
      if (page <= totalDocs) {
        skip = limit * (page - 1);
      }
      skip = 0;
    }
    const result: Array<IUser> = await user.readUsers({}, limit, skip);
    response.status(200).json({
      serverResponse: result,
      totalDocs,
      limit,
      totalpage,
      page,
    });
    return;
  }
  public async getUser(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    //let id: string = request.params.id;
    let res = await user.readUsers(request.params.id);
    response.status(200).json(res);
  }
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
  public async getUs(request: Request, response: Response) {
    var Us: BusinessUser = new BusinessUser();
    //let id: string = request.params.id;
    let res = await Us.readUser(request.params.post);
    response.status(200).json({ serverResponse: res });
  }
  /*public async addRol(request: Request, response: Response) {
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
  }*/
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
  /* public async removeUserRol(request: Request, response: Response) {
     let roles: BusinessUser = new BusinessUser();
     let idUs: string = request.params.id;
     let idRol: string = request.body.idRol;
     let result = await roles.removeRol(idUs, idRol);
     response.status(200).json({ serverResponse: result });
   }*/

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
        username: userResult.user.sort({ '_id': -1 });avatar,
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
  ///-----------Organizacion-------------------
  public async createOrg(request: Request, response: Response) {
    let org: BussinesOrganizacion = new BussinesOrganizacion();
    var orgData: any = request.body;
    let result = await org.addOrganizacion(orgData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async addSubdir(request: Request, response: Response) {
    let idOrg: string = request.params.id;
    //let idSub = request.body.idSub;
    if (idOrg == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var org: BussinesOrganizacion = new BussinesOrganizacion();
    //var userResult: IUser = await orgToUpdate.save();
    let subdir: BussinesSubdir = new BussinesSubdir();
    var subdirData: any = request.body;
    var result1 = await subdir.addSubdir(subdirData);
    let idSub = result1._id;
    var result = await org.addSub(idOrg, idSub);

    //var result = subdirData
    if (result == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }
  public async getOrg(request: Request, response: Response) {
    let org: BussinesOrganizacion = new BussinesOrganizacion();
    let result = await org.readOrgs();
    response.status(200).json(result);
  }
  public async getOr(request: Request, response: Response) {
    var org: BussinesOrganizacion = new BussinesOrganizacion();
    //let id: string = request.params.id;
    let res = await org.readOrgs(request.params.nombredir);
    response.status(200).json(res);
  }
  public async getOrId(request: Request, response: Response) {
    var org: BussinesOrganizacion = new BussinesOrganizacion();
    //let id: string = request.params.id;
    let res = await org.readOrg(request.params.id);
    response.status(200).json(res);
  }
  public async updateOr(request: Request, response: Response) {
    var org: BussinesOrganizacion = new BussinesOrganizacion();
    let id: string = request.params.id;
    var params = request.body;
    var result = await org.updateOrg(id, params);
    response.status(200).json(result);
  }
  public async removeOrg(request: Request, response: Response) {
    let org: BussinesOrganizacion = new BussinesOrganizacion();
    let idOrg: string = request.params.id;
    let result = await org.deleteOrg(idOrg);
    response.status(201).json({ serverResponse: result });
  }

  ///______________SUB DIRECCIONES__________________

  public async createSubdir(request: Request, response: Response) {
    let subdir: BussinesSubdir = new BussinesSubdir();
    var subdirData: any = request.body;
    let result = await subdir.addSubdir(subdirData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getSubdir(request: Request, response: Response) {
    let subdir: BussinesSubdir = new BussinesSubdir();
    let result = await subdir.readSub();
    response.status(200).json(result);
  }
  public async updateSubdir(request: Request, response: Response) {
    var subdir: BussinesSubdir = new BussinesSubdir();
    let id: string = request.params.id;
    var params = request.body;
    var result = await subdir.updateSubdi(id, params);
    response.status(200).json(result);
  }
  public async removeSubdir(request: Request, response: Response) {
    let subdir: BussinesSubdir = new BussinesSubdir();
    let idSubdir: string = request.params.id;
    let result = await subdir.deleteSubdir(idSubdir);
    response.status(201).json({ serverResponse: result });
  }
  ///////////////HOJA DE RUTA------------------------------

  public async createHojas(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    var hojaData = request.body;
    hojaData["fecharesepcion"] = new Date();
    hojaData["estado"] = "REGISTRADO";
    let result = await hoja.addHoja(hojaData);
    if (result == null) {
      response.status(300).json({ serverResponse: "No se registro" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getHojas(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    const result1 = await hoja.total({});
    var totalDocs = result1;
    var limit = parseInt(request.params.limit, 10) || 10;
    var page = parseInt(request.params.page, 10) || 0;
    var totalpage = Math.ceil(totalDocs / limit);
    var skip = 0;
    if (page == 1 || !page || page == undefined) {
      skip = 0;
    } else {
      if (page <= totalDocs) {
        skip = limit * (page - 1);
        skip = skip + 1;
      } else {
        skip = 0;
      }
    }
    const result = await hoja.readHoja({}, limit, skip);
    response.status(200).json({
      serverResponse: result,
      totalDocs,
      limit,
      totalpage,
      page,
      skip,
    });
    return;
  }
  public async getHojaRutas(request: Request, response: Response) {
    var segui: BusinessHoja = new BusinessHoja();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.origen != null) {
      var expresion = new RegExp(params.origen);
      filter["origen"] = expresion;
    }
    if (params.referencia != null) {
      var expresion = new RegExp(params.referencia);
      filter["referencia"] = expresion;
    }
    if (params.nuit != null) {
      var expresion = new RegExp(params.nuit);
      filter["nuit"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gt"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lt"] = lt;
    }
    if ( Object.entries(aux).length > 0) { 
      filter["fecharecepcion"] = aux;
    }
    if (params.skip) {
      skip = parseInt(params.skip);
      if ( skip >= 2) {
        skip = limit * (skip - 1);
      } else {
        skip = 0;
      }
    }
    if (params.order != null) {
      var data = params.order.split(",");
      var number = parseInt(data[1]);
      order[data[0]] = number;
    } else {
      order = { _id: -1 };
    }
    const [ res, totalDocs ] = await Promise.all([
      segui.readHojaRuta(filter,
        skip,
        limit,
        order),
       segui.total({})
    ])
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage: number = Math.ceil(totalDocs/ limit),
      skip,
      order
    });
    return;
  }
  public async getHoja(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    //let id: string = request.params.id;
    let res = await hoja.readHoja(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchHoja(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    var searchString = request.params.search;
    let res = await hoja.search(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async asociarHojas(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    //let id: string = request.params.id;
    let res = await hoja.asodHoja(request.params.nuit);
    if (res == null) {
      response.status(300).json({ serverResponse: "nulo" });
      return;
    }
    response.status(200).json({ serverResponse: res });
  }
  public async asociarHoja(request: Request, response: Response) {
    let idH: string = request.params.nuit;
    let asociado: any = request.body.asociado;
    if (idH == null && asociado == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del rol",
      });
      return;
    }
    var user: BusinessHoja = new BusinessHoja();
    var result1 = await user.asociarHojaA(idH, asociado);
    var result2 = await user.asociarHojaB(idH, asociado);
    if (result1 == null) {
      response.status(300).json({ serverResponse: "No se pudo guardar" });
      return;
    }
    response.status(200).json({ serverResponse: "ok" });
  }
  public async uploadHoja(request: Request, response: Response) {
    var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para subir una foto" });
      return;
    }
    var hoja: BusinessHoja = new BusinessHoja();
    var hojaToUpdate: IHojaruta = await hoja.readHoja(id);
    if (!hojaToUpdate) {
      response
        .status(300)
        .json({ serverResponse: "El Hoja de ruta no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploadhojaruta`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;
    var key: Array<string> = Object.keys(files);
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
    let fil: BussinesFile = new BussinesFile();
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 7);
      var newname: string = `${"GAMB"}_${filehash}_${file.name}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      var hojaResult: IHojaruta = await hojaToUpdate.save();
      filData["idhj"] = id;
      filData["urihoja"] = "gethojaruta/" + newname;
      filData["pathhoja"] = totalpath;
      filData["namefile"] = newname;
      var result1 = await fil.addFile(filData);
      let idFile = result1._id;
      var result = await hoja.addFiles(id, idFile);
      if (result == null) {
        response.status(300).json({ serverResponse: "no se pudo guardar..." });
        return;
      }
    }
  }

  public async createFile(request: Request, response: Response) {
    var file: BussinesFile = new BussinesFile();
    var fileData: any = request.body;
    let result = await file.addFile(fileData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }

  public async getHojaRuta(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var file: BussinesFile = new BussinesFile();
    var fileData: IFiles = await file.readFile(name);
    if (!fileData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (fileData.pathhoja == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(fileData.pathhoja);
  }

  public async updateHoja(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    let id: string = request.params.id;
    var params = request.body;
    var result = await hoja.updateHojas(id, params);
    response.status(200).json(result);
  }
  public async removeHoja(request: Request, response: Response) {
    let hoja: BusinessHoja = new BusinessHoja();
    let idHoja: string = request.params.id;
    let result = await hoja.deleteHojas(idHoja);
    response.status(201).json({ serverResponse: result });
  }

  public async addSegui(request: Request, response: Response) {
    let idRuta: string = request.params.id;
    //let idSub = request.body.idSub;
    if (idRuta == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var ruta: BusinessHoja = new BusinessHoja();
    //var userResult: IUser = await orgToUpdate.save();
    let segui: BussinesSegui = new BussinesSegui();
    var seguiData: any = request.body;
    seguiData["fechaderivado"] = new Date();
    seguiData["idhj"] = idRuta;
    seguiData["fecharecepcion"] = "SIN RESEPCIONAR";
    seguiData["estado"] = "ENVIADO";
    // console.log(seguiData);
    var result1 = await segui.addSegui(seguiData);
    //let idSegui = result1._id;
    //var result = await ruta.addSeguim(idRuta, idSegui);
    //console.log(result + "esto es el resultado");
    if (result1 == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar..." });
      return;
    }
    response.status(200).json({ serverResponse: result1 });
  }

  ///-----------seguimiento---------------
  public async createSegui(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();

    var seguiData: any = request.body;
    //seguiData["fecharesepcion"] =  new Date();
    seguiData["fechaderivado"] = new Date();
    seguiData["estado"] = "REGISTRADO";
    let result = await segui.addSegui(seguiData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getSeguis(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    const result: Array<ISeguimiento> = await segui.readSegui();
    response.status(200).json(result);
  }
  public async getSegui(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let id: string = request.params.id;
    let res = await segui.readSegui(request.params.id);
    response.status(200).json(res);
  }
  public async getSeguiAs(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let nuit: string = request.params.nuit;
    let res = await segui.readSeguiAs(request.params.nuit);
    response.status(200).json(res);
  }
  public async getSeguiO(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    var destino = request.params.destino;
    var limit = parseInt(request.params.limit, 10) || 3000;
    var page = parseInt(request.params.page, 10) || 0;
    var skip = 0;
    var totalDocs = 0;
    var totalpage = 0;
    if (page == 1 || !page || page == undefined) {
      skip = 0;
    } else {
      if (page <= totalDocs) {
        skip = limit * (page - 1);
        skip = skip + 1;
      } else {
        skip = 0;
      }
    }
    let res = await segui.readSeguiO(destino, limit, skip);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      page,
      skip,
    });
    return;
  }
  public async getOficina(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.destino != null) {
      var expresion = new RegExp(params.destino);
      filter["destino"] = expresion;
    }
    if (params.estado != null) {
      var expresion = new RegExp(params.estado);
      filter["estado"] = expresion;
    }
    if (params.nuit != null) {
      var expresion = new RegExp(params.nuit);
      filter["nuit"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gt"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lt"] = lt;
    }
    if ( Object.entries(aux).length > 0) { 
      filter["fecharecepcion"] = aux;
    }
    let respost: Array<ISeguimiento> = await segui.readOficina(filter);
    var totalDocs = respost.length;
    var totalpage = Math.ceil(respost.length / limit);
    if (params.skip) {
      skip = parseInt(params.skip);
      if (skip <= totalpage && skip >= 2) {
        skip = limit * (skip - 1);
      } else {
        skip = 0;
      }
    }
    if (params.order != null) {
      var data = params.order.split(",");
      var number = parseInt(data[1]);
      order[data[0]] = number;
    } else {
      order = { nuit: -1 };
    }
    let res: Array<ISeguimiento> = await segui.readOficina(
      filter,
      skip,
      limit,
      order
    );
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
    });
    return;
  }
  public async updateSegui(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let id: string = request.params.id;
    var params = request.body;
    var result = await segui.updateSegui(id, params);
    response.status(200).json(result);
  }
  public async updateSeguiAs(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let nuit: string = request.params.nuit;
    var params = request.body;
    var result = await segui.updateSeguiAs(nuit, params);
    response.status(200).json(result);
  }
  public async removeSegui(request: Request, response: Response) {
    let segui: BussinesSegui = new BussinesSegui();
    let idHoja: string = request.params.id;
    let result = await segui.deleteSegui(idHoja);
    response.status(201).json({ serverResponse: result });
  }
}
export default RoutesController;
