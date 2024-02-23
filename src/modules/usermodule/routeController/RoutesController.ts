import { IFiles } from "./../models/Files";
import { IHojaruta, ISimpleHojaruta } from "./../models/Hojaruta";
import { IOrganizacion } from "./../models/Organizacion";
const ObjectId = require("mongoose").Types.ObjectId;

import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import BussinessRoles from "../businessController/BussinessRoles";
import BussinesOrganizacion from "../businessController/BussinesOrganizacion";
import BussinesSubdir from "../businessController/BussinesSubdir";
import BussinesSegui from "../businessController/BussinesSegui";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import Users, { IUser } from "../models/Users";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import BusinessHoja from "../businessController/BussineHojaruta";
import { ISeguimiento } from "../models/Seguimiento";
import BussinesFile from "../businessController/BussinesFlies";
import { IArchivo } from "../models/archivo";
import BussnesArchivo from "../businessController/BusinessArch";
import { isValidObjectId } from "mongoose";
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
        id: loginUser._id,
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
    const result: Array<IUser> = await user.readUsers();

    response.status(200).json({ serverResponse: result });
  }
  public async lisUsers(request: Request, response: Response) {
    const user: BusinessUser = new BusinessUser();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.cargo != null) {
      var expresion = new RegExp(params.cargo);
      filter["cargo"] = expresion;
    }
    if (params.post != null) {
      var expresion = new RegExp(params.post);
      filter["post"] = expresion;
    }
    if (params.isActive != null) {
      var expres:boolean = params.isActive;
      filter["isActive"] = expres;
    }
    if (params.roles != null) {
      let expresion = params.roles;
      filter["roles"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gte"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    let respost = await user.total(filter);
    var totalDocs = respost;
    var totalpage = Math.ceil(respost / limit);
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
      order = { _id: -1 };
    }
    const result: Array<IUser> = await user.readUsers(
      filter,
      limit,
      skip,
      order
    );
   
    response.status(200).json({
      serverResponse: result,
      limit,
      totalDocs,
      totalpage,
      skip,
      order
    });
    return;
  }
  public async getUser(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    //let id: string = request.params.id;
    let res = await user.readUsers(request.params.id);
    response.status(200).json(res);
  }
  public async updateUser(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let subdir: BussinesSubdir = new BussinesSubdir();
    let id: string = request.params.id;
    var params = request.body;
    if (params["password"] != null) {
      params["password"] = sha1(params["password"]);
    }
    if(params.cargo){
      var sub:any = await subdir.readSubId(params.cargo);
      params.post=sub.nombresubdir
      params.user=id
      await subdir.updateSubdi(sub._id, params);
    }
    var result = await user.updateUser(id, params);
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
    response.status(200).json({ serverResponse: result });
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
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para subir una foto" });
      return;
    }
    if (!ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) {
        let res = await user.readUsers(id);
        response.status(300).json("No es un Indentificador");
        return;
      }
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
    var dir = `${__dirname}/../../../../uploads/users`;
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
    pathViejo = userToUpdate.pathavatar;
    borrarImagen(pathViejo);

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
    /* var simpleUser: ISimpleUser = {
      username: userResult.username,
      uriavatar: userResult.uriavatar,
      pathavatar: userResult.pathavatar,
    };
    response.status(200).json({ serverResponse: simpleUser }); */
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
  public async removSubdir(request: Request, response: Response) {
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
    //var result1 = await subdir.addSubdir(subdirData);
    let idSub = subdirData._id;
    var result = await org.removeSub(idOrg, idSub);

    //var result = subdirData
    /* if (result == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar" });
      return;
    } */
    response.status(200).json({ serverResponse: "probando" });
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
  public async getSubUni(request: Request, response: Response) {
    var subUni: BussinesSubdir = new BussinesSubdir();
    //let id: string = request.params.id;
    let res = await subUni.readSub(request.params.nombredir);
    response.status(200).json(res);
  }
  public async getSubUnidad(request: Request, response: Response) {
    var subUni: BussinesSubdir = new BussinesSubdir();
    //let id: string = request.params.id;
    let res = await subUni.readSubId(request.params.id);
    response.status(200).json(res);
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
  ////ARCHIVO/////
  public async createArch(request: Request, response: Response) {
    let subdir: BussnesArchivo = new BussnesArchivo();
    var subdirData: any = request.body;
    let result = await subdir.addArch(subdirData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async addArch(request: Request, response: Response) {
    let idSegui: string = request.params.id;
    if (idSegui == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var segui: BussinesSegui = new BussinesSegui();
    let arch: BussnesArchivo = new BussnesArchivo();
    var subdirData: any = request.body;
    var result1 = await arch.addArch(subdirData);
    let idArch = result1._id;
    var result = await segui.addArchivo(idSegui, idArch);

    //var result = subdirData
    if (result == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }
  public async getArc(request: Request, response: Response) {
    var subUni: BussnesArchivo = new BussnesArchivo();
    //let id: string = request.params.id;
    let res = await subUni.readArch(request.params.nombredir);
    response.status(200).json(res);
  }
  public async updateArch(request: Request, response: Response) {
    var arch: BussnesArchivo = new BussnesArchivo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await arch.updateArch(id, params);
    response.status(200).json(result);
  }
  public async removeArch(request: Request, response: Response) {
    let arch: BussnesArchivo = new BussnesArchivo();
    let idArch: string = request.params.id;
    let result = await arch.deleteArch(idArch);
    response.status(201).json({ serverResponse: result });
  }
  ///////////////HOJA DE RUTA------------------------------

  public async createHojas(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    var hojaData = request.body;
    const resp: any = await hoja.getNuit();
    let nuit: any = resp[0].nuit.split("-");
    let simpleNuit: any = nuit[0];
    let nuitok: number = parseInt(simpleNuit);
    hojaData["fecharesepcion"] = new Date();
    hojaData["estado"] = "REGISTRADO";
    hojaData["nuit"] = nuitok + 1;
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
    if (params.fecharesepcion != null) {
      var expresion = new RegExp(params.fecharesepcion);
      filter["fecharesepcion"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gte"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fecharesepcion"] = aux;
    }
    //let respost: Array<IHojaruta> = await segui.readHojaRuta(filter);
    let totalHR: any = await segui.total(filter);
    const resp: any = await segui.getNuit();
    let nuit: any = resp[0].nuit.split("-");
    let simpleNuit: any = nuit[0];
    let nuitok: number = parseInt(simpleNuit);
    var totalDocs = totalHR;
    var totalpage = Math.ceil(totalHR / limit);
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
      order = { _id: -1 };
    }
    let res: Array<IHojaruta> = await segui.readHojaRuta(
      filter,
      skip,
      limit,
      order
    );
    /* const [res, totalDocs] = await Promise.all([
      segui.readHojaRuta(filter, skip, limit, order),
      segui.total({}),
    ]); */
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
      order,
      nuitok,
    });
    return;
  }
  public async contHRuta(request: Request, response: Response) {
    var ruta: BusinessHoja = new BusinessHoja();
    var filter: any = {};
    var filter1: any = {};
    var filter2: any = {};
    var filter3: any = {};
    var params: any = request.query;
    var aux: any = {};
    filter1["estado"] = "ENVIADO";
    filter2["estado"] = "REGISTRADO";
    filter3["estado"] = "RECIBIDO";
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gte"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lte"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fecharesepcion"] = aux;
      filter1["fecharesepcion"] = aux;
      filter2["fecharesepcion"] = aux;
      filter3["fecharesepcion"] = aux;
    }
    const [total, enviado, registrado, recibido] = await Promise.all([
      ruta.total(filter),
      ruta.total(filter1),
      ruta.total(filter2),
      ruta.total(filter3),
    ]);
    response.status(200).json({
      total,
      enviado,
      registrado,
      recibido,
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
  public async searchPublicHR(request: Request, response: Response) {
    var hoja: BusinessHoja = new BusinessHoja();
    var searchString = request.params.term;
    let res = await hoja.searchPublicHR(searchString);
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

  public async eliminarEnvio(request: Request, response: Response) {
    const hojaRuta: BusinessHoja = new BusinessHoja();
    const segui: BussinesSegui = new BussinesSegui();
    let idHR = request.params.id
    let params = request.body;
    let res = await hojaRuta.readHoja(idHR);
    let segRes = res.seguimiento[res.seguimiento.length - 1];
    if(segRes.estado==="ENVIADO" ){
      await segui.deleteSegui(segRes._id);
      params.estado="RECIBIDO"
      await hojaRuta.updateHojas(idHR, params);
      await hojaRuta.removeIdHR(idHR, segRes._id);
      response.status(200).json({ serverResponse: "Se eliminó el envio" });
    }else{
      response.status(300).json({ serverResponse: "Esta Hoja de Ruta ya tiene varios seguimientos ó ya fue Recibido" });
      return;
    }
  }

  public async asociarHR(request: Request, response: Response) {
    const hojaRuta: BusinessHoja = new BusinessHoja();
    const segui: BussinesSegui = new BussinesSegui();
    let nuitA: string = request.params.nuit;
    let nuitB: string = request.body.nuit;
    let resA = await hojaRuta.getNuitOne(nuitA);
    let resB = await hojaRuta.getNuitOne(nuitB);
    if (resA == null || resB == null) {
      response.status(300).json({
        serverResponse: `No se encontró Nº ${nuitA} o Nº ${nuitB}`,
      });
      return;
    }
    let segResA = resA.seguimiento[resA.seguimiento.length - 1];
    let segResB = resB.seguimiento[resB.seguimiento.length - 1];
    if(request.body.cargo==="SECRETARIA DE DESPACHO"){
      if (segResB == null) {
        response.status(300).json({
          serverResponse: `No se encontró seguimiento de Nº ${nuitB}`,
        });
        return;
      }
      if (segResB.estado != "RECIBIDO" || segResB.destino != request.body.cargo) {
        if (resB.estado==="ENVIADO" ) {
        var checksub: Array<IHojaruta> = resA.asociados.filter((item: any) => {
          if (resB._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checksub.length == 0) {    
          await hojaRuta.addIdHR(resA._id, resB._id);
          await hojaRuta.addIdHR(resB._id, resA._id);
          let data: any = { estado: `Asociado al Nº ${nuitA}`};
          await segui.updateSegui(segResB._id, data);
          if(resB.asociados.length!=0){ 
            let resAso:any = resB.asociados;
            for(let i = 0; i < resAso.length; i++){
              let dataAso = resAso[i];
              let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
              await hojaRuta.addIdHR(resA._id, dataAso._id);
              await hojaRuta.addIdHR(dataAso._id,resA._id);
              //await segui.updateSegui(segResData._id, data);
            }
          }
          if(resA.asociados.length!=0){ 
            let resAso:any = resA.asociados;
            for(let i = 0; i < resAso.length; i++){
              let dataAso = resAso[i];
              let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
              await hojaRuta.addIdHR(resB._id, dataAso._id);
              await hojaRuta.addIdHR(dataAso._id,resB._id);
              //await segui.updateSegui(segResData._id, data);
            }
          }         
        }
        response.status(200).json({ serverResponse: resA, resB });
        return;
      }
        response.status(300).json({
          serverResponse: `El Nº ${nuitB} debe estar en estado RECIBIDO y en su OFICINA`,
        });
        return;
      }
      var checksub: Array<IHojaruta> = resA.asociados.filter((item: any) => {
        if (resB._id.toString() == item._id.toString()) {
          return true;
        }
        return false;
      });
      if (checksub.length == 0) {   
        await hojaRuta.addIdHR(resA._id, resB._id);
        await hojaRuta.addIdHR(resB._id, resA._id);
        let data: any = { estado: `Asociado al Nº ${nuitA}`};
        await segui.updateSegui(segResB._id, data);
        if(resB.asociados.length!=0){  
          let resAso:any = resB.asociados;
          for(let i = 0; i < resAso.length; i++){
            let dataAso = resAso[i];
            let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
            await hojaRuta.addIdHR(resA._id, dataAso._id);
            await hojaRuta.addIdHR(dataAso._id,resA._id);
            //await segui.updateSegui(segResData._id, data);
          }
        }
        if(resA.asociados.length!=0){ 
          let resAso:any = resA.asociados;
          for(let i = 0; i < resAso.length; i++){
            let dataAso = resAso[i];
            let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
            await hojaRuta.addIdHR(resB._id, dataAso._id);
            await hojaRuta.addIdHR(dataAso._id,resB._id);
            //await segui.updateSegui(segResData._id, data);
          }
        }
        response.status(200).json({ serverResponse: resA, resB });
        return;
      }
    }
    if (segResA == null || segResB == null) {
      response.status(300).json({
        serverResponse: `No se encontró seguimiento de Nº ${nuitA} o Nº ${nuitB}`,
      });
      return;
    }
    if (segResA.estado != "RECIBIDO" || segResA.destino != request.body.cargo) {
      response.status(300).json({
        serverResponse: `El Nº ${nuitA} debe estar en estado RECIBIDO y en su OFICINA`,
      });
      return;
    }
    if (segResB.estado != "RECIBIDO" || segResB.destino != request.body.cargo) {
      response.status(300).json({
        serverResponse: `El Nº ${nuitB} debe estar en estado RECIBIDO y en su OFICINA`,
      });
      return;
    }
    if(+nuitA === +nuitB){
      response.status(300).json({
        serverResponse: `No se puede asociar a la misma Hoja de Ruta`,
      });
      return;
    }
    var checksub: Array<IHojaruta> = resA.asociados.filter((item: any) => {
      if (resB._id.toString() == item._id.toString()) {
        return true;
      }
      return false;
    });
    if (checksub.length == 0) {
      await hojaRuta.addIdHR(resA._id, resB._id);
      await hojaRuta.addIdHR(resB._id, resA._id);
      let data: any = { estado: `Asociado al Nº ${nuitA}`};
      await segui.updateSegui(segResB._id, data);
      if(resB.asociados.length!=0){  
        let resAso:any = resB.asociados;
        for(let i = 0; i < resAso.length; i++){
          let dataAso = resAso[i];
          let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
          await hojaRuta.addIdHR(resA._id, dataAso._id);
          await hojaRuta.addIdHR(dataAso._id,resA._id);
          //await segui.updateSegui(segResData._id, data);
        }
      }
      if(resA.asociados.length!=0){  
        let resAso:any = resA.asociados;
        for(let i = 0; i < resAso.length; i++){
          let dataAso = resAso[i];
          let segResData = dataAso.seguimiento[dataAso.seguimiento.length - 1];
          await hojaRuta.addIdHR(resB._id, dataAso._id);
          await hojaRuta.addIdHR(dataAso._id,resB._id);
          //await segui.updateSegui(segResData._id, data);
        }
      }
      
      // console.log(segResA,segResB);
      response.status(200).json({ serverResponse: resA, resB });
      return;
    }
    response
      .status(300)
      .json({
        serverResponse: "Esta Hoja de ruta ya esta asociado a este Nº ",
      });
    return;
  }

  //PROBAR CON Q EXISTE

  public async addSubUni(request: Request, response: Response) {
    let idOrg: string = request.params.id;
    let idSub = request.body;
    var org: BussinesOrganizacion = new BussinesOrganizacion();
    let subdir: BussinesSubdir = new BussinesSubdir();
    let orgResult: any = await org.readOrg(idOrg);
    if (orgResult != null) {
      var sub = await subdir.readSub(idSub);
      if (sub != null) {
        var checksub: any = orgResult.subdirecciones.filter((item: any) => {
          if (sub._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checksub.length == 0) {
          var result = await org.addSubUni(idOrg, idSub);
          response.status(200).json({ serverResponse: sub });
          return;
        }
        response.status(300).json({ serverResponse: "Ya existe SUB UNIDAD" });
        return;
      }
    }
  }
  
  /* public async removeCargo(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let idUser: string = request.params.id;
    let idSub = request.body;
    if (idUser == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var result = await user.removeCargo(idUser, idSub);
    let resultUser: any = await user.readUsers(idUser);
    response.status(200).json({ serverResponse: resultUser });
  } */

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
    seguiData["fecharecepcion"] = "SIN RECEPCIONAR";
    seguiData["estado"] = "ENVIADO";
    var result1 = await segui.addSegui(seguiData);
    let idSegui = result1._id;
    var result = await ruta.addSeguim(idRuta, idSegui);
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
    let res = await segui.readSeguiAs(nuit);
    response.status(200).json(res);
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
    if(params.destino === "" || params.destino === "null" ){
      delete params.destino;
    }
    if (params.destino != null) {
      if (params.destino.includes("(")) {
        const searchValue = decodeURIComponent(params.destino);
        const escapedSearchValue = searchValue.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const escaped = new RegExp(escapedSearchValue, "i");
        //var expresion = new RegExp(params.destino);
        filter["destino"] = escaped;
      } else {
        filter["destino"] = params.destino;
      }
    }
    if (params.estado != null) {
      var expresion = new RegExp(params.estado);
      filter["estado"] = expresion;
    }
    if (params.recibidox != null) {
      let expresionRec = params.recibidox;
      filter["recibidox"] = expresionRec;
    }
    if (params.fecharecepcion != null) {
      var expresion = new RegExp(params.fecharecepcion);
      filter["fecharecepcion"] = expresion;
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
      aux["$gte"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lte"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fechaderivado"] = aux;
    }
    let respost = await segui.total(filter);
    var totalDocs = respost;
    var totalpage = Math.ceil(respost / limit);
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
      order = { fechaderivado: -1 };
    }
    console.log("paramas", filter);
    
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
  public async contOficina(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    var filter: any = {};
    var filter1: any = {};
    var filter2: any = {};
    var filter3: any = {};
    var filter4: any = {};
    var filter5: any = {};
    var params: any = request.query;
    var aux: any = {};
    filter1["estado"] = "ENVIADO";
    filter2["estado"] = "DERIVADO";
    filter3["estado"] = "RECIBIDO";
    filter4["estado"] = "MALETIN";
    filter5["estado"] = "FILE OFICINA";
    if (params.destino != null) {
      //var expresion = new RegExp(params.destino);
      filter["destino"] = params.destino;
      filter1["destino"] = params.destino;
      filter2["destino"] = params.destino;
      filter3["destino"] = params.destino;
      filter4["destino"] = params.destino;
      filter5["destino"] = params.destino;
    }
    if (params.dategt != null) {
      var gt = params.dategt;
      aux["$gte"] = gt;
    }
    if (params.datelt != null) {
      var lt = params.datelt;
      aux["$lte"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fechaderivado"] = aux;
      filter1["fechaderivado"] = aux;
      filter2["fechaderivado"] = aux;
      filter3["fechaderivado"] = aux;
      filter4["fechaderivado"] = aux;
      filter5["fechaderivado"] = aux;
    }
    const [total, enviado, derivado, recibido, maletin, fileOficina] =
      await Promise.all([
        segui.total(filter),
        segui.total(filter1),
        segui.total(filter2),
        segui.total(filter3),
        segui.total(filter4),
        segui.total(filter5),
      ]);
    response.status(200).json({
      total,
      enviado,
      derivado,
      recibido,
      maletin,
      fileOficina,
    });
    return;
  }
  public async updateSegui(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let id: string = request.params.id;
    var params = request.body;
    console.log("params", params);

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
  public async updateSeguiOfi(request: Request, response: Response) {
    var segui: BussinesSegui = new BussinesSegui();
    let oficina: string = request.params.oficina;
    var params = request.body;
    var result = await segui.updateSeguiOfi(oficina, params);
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
