import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import slug from "slugify";
import sharp from "sharp";
//import csv from "fast-csv";
import * as csv from "@fast-csv/parse";

import { ICarpeta } from "../models/carpeta";
import BussCarpeta from "../bussinesController/carpeta";
import { IAreaContabilida } from "../models/contabilidad";
import BussConta from "../bussinesController/contabilidad";
import { IArea } from "../models/area";
import BussArea from "../bussinesController/area";
class RoutesController {
  //* ---------------CARPETAS--------------*//
  public async createCarpeta(request: Request, response: Response) {
    var carpeta: BussCarpeta = new BussCarpeta();
    var CarpetaData = request.body;
    //console.log("Area", ContaData);
    let result = await carpeta.addCarpeta(CarpetaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getCarpetas(request: Request, response: Response) {
    var carpeta: BussCarpeta = new BussCarpeta();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = { gestion: -1 };
    if (params.area != null) {
      var area = new RegExp(params.area, "i");
      filter["area"] = area;
    }
    if (params.tipo != null) {
      var tipo = new RegExp(params.tipo, "i");
      filter["tipo"] = tipo;
    }
    if (params.gestion != null) {
      var gestion = new RegExp(params.gestion, "i");
      filter["gestion"] = gestion;
    }
    if (params.objeto != null) {
      var objeto = new RegExp(params.objeto, "i");
      filter["objeto"] = objeto;
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
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    if (params.skip) {
      skip = parseInt(params.skip);
      if (skip >= 2) {
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
      order = { gestion: -1 };
    }
    const [res, totalDocs] = await Promise.all([
      carpeta.readCarpeta(filter, skip, limit, order),
      carpeta.total({}),
    ]);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage: (number = Math.ceil(totalDocs / limit)),
      skip,
      order,
    });
    return;
  }
  public async getCarpeta(request: Request, response: Response) {
    var Carpeta: BussCarpeta = new BussCarpeta();
    //let id: string = request.params.id;
    let res = await Carpeta.readCarpeta(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchCarpeta(request: Request, response: Response) {
    var Carpeta: BussCarpeta = new BussCarpeta();
    var searchString = request.params.search;
    let res = await Carpeta.searchCarpeta(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async removeCarpeta(request: Request, response: Response) {
    /* const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = ""; */
    var Carpeta: BussCarpeta = new BussCarpeta();
    let id: string = request.params.id;
    let res = await Carpeta.readCarpeta(id);
    let result = await Carpeta.deleteCarpeta(id);
    /*  pathViejo = res.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Se eliminó la Carpeta" });
  }
  public async uploadCarpeta(request: Request, response: Response) {
    /* const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = ""; */
    var Carpeta: BussCarpeta = new BussCarpeta();
    var id: string = request.params.id;
    var CarpetaToUpdate: ICarpeta = await Carpeta.readCarpeta(id);
    if (!CarpetaToUpdate) {
      response.status(300).json({ serverResponse: "Carpeta no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await Carpeta.updateCarpeta(id, filData);
      response.status(200).json({ serverResponse: "Carpeta modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      var filData: any = request.body;
      var carpeta: ICarpeta = await Carpeta.addCarpeta(filData);
      console.log(carpeta);
      response.status(300).json({ serverResponse: carpeta });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/archivos`;
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
    if (!id) {
      var filData = request.body;
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = ["pdf"];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${filData.area}_${
          filData.gestion
        }.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getCarpeta/" + newname;
        filData.path = totalpath;
        var sliderResult: ICarpeta = await Carpeta.addCarpeta(filData);
      }
      response.status(200).json({
        serverResponse: sliderResult,
      });
      return;
    }
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["pdf"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filData.area}_${
        filData.gestion
      }.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      /* pathViejo = CarpetaToUpdate.path;
      filData.path = totalpath;
      if(totalpath!=CarpetaToUpdate.path){
        borrarImagen(pathViejo);
      } */
      filData.uri = "getCarpeta/" + newname;
      var Result = await Carpeta.updateCarpeta(id, filData);
      response.status(200).json({ serverResponse: "Carpeta modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getFileCarpeta(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Carpeta: BussCarpeta = new BussCarpeta();
    var CarpetaData: ICarpeta = await Carpeta.readCarpetaFile(name);
    if (!CarpetaData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      //response.status(300).json({ serverResponse: "Error " });
      return;
    }
    /* if (CarpetaData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(CarpetaData.path); */
  }
  public async updateCarpeta(request: Request, response: Response) {
    var Carpeta: BussCarpeta = new BussCarpeta();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Carpeta.updateCarpeta(id, params);
    response.status(200).json({ res: "se editó" });
  }
  public async addArea(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    let idCarpeta: string = request.params.id;
    var Carpeta: BussCarpeta = new BussCarpeta();
    let conta: BussConta = new BussConta();
    if (idCarpeta == null) {
      response.status(300).json({ serverResponse: "El id es necesario" });
      return;
    }
    let carpetaResult = await Carpeta.readCarpeta(idCarpeta);
    let area = carpetaResult.area;
    var contaData: any = request.body;
    contaData.idCarpeta = idCarpeta;
    console.log("Area", contaData);
    let result: any = {};
    let result1: any = {};
    if (isEmpty(request.files)) {
      if(area === "contabilidad"){
        var resultArea: IAreaContabilida = await conta.addConta(contaData);
        console.log("paso x aqui");
        response.status(200).json({ serverResponse: resultArea });
        let idArea = resultArea._id;
        result = await Carpeta.addContaId(idCarpeta, idArea);
        return;
      }
    }
    //SUBIR Archivo
    var dir = `${__dirname}/../../../../uploads/archivos`;
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
    if (area === "contabilidad") {
      for (var i = 0; i < key.length; i++) {
        console.log("no paso x aqui");
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = ["pdf"];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${area}_${carpetaResult.tipo}_${"N°"}${
          contaData.numero
        }_${carpetaResult.gestion}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        contaData.archivo = newname;
        contaData.uri = "getCarpeta/" + newname;
        contaData.path = totalpath;
        var resultArea: IAreaContabilida = await conta.addConta(contaData);
      }
      let idArea = resultArea._id;
      result = await Carpeta.addContaId(idCarpeta, idArea);
    }
    if (area === "juridica") {
      /* result1 = await conta.addConta(contaData);
      let idArea = result1._id;
      result = await Carpeta.addContaId(idCarpeta, idArea); */
    }
    if (resultArea == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar" });
      return;
    }
    response.status(200).json({ serverResponse: resultArea });
  }
  public async addAreas(request: Request, response: Response) {
    let idCarpeta: string = request.params.id;
    let idArea = request.body;
    var carpeta: BussCarpeta = new BussCarpeta();
    let area: BussConta = new BussConta();
    let carpetaResult: any = await carpeta.readCarpeta(idCarpeta);
    if (carpetaResult != null) {
      var resultArea = await area.readConta(idArea.contabilidad);
      if (resultArea != null) {
        var checksub: any = carpetaResult.contabilidad.filter((item: any) => {
          if (resultArea._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checksub.length == 0) {
          var result = await carpeta.addContaId(idCarpeta, idArea);
          response.status(200).json({ serverResponse: resultArea });
          return;
        }
        response
          .status(300)
          .json({ serverResponse: "Ya existe DETALLE UNIDAD" });
        return;
      }
    }
  }

  //----------CONTABILIDAD------------//
  public async createConta(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    var ContaData = request.body;
    console.log("Area", ContaData);
    let result = await Conta.addConta(ContaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getContas(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.detalle != null) {
      var detalle = new RegExp(params.detalle, "i");
      filter["detalle"] = detalle;
    }
    if (params.beneficiario != null) {
      var beneficiario = new RegExp(params.beneficiario, "i");
      filter["beneficiario"] = beneficiario;
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
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    let respost: Array<IAreaContabilida> = await Conta.readConta();
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
      order = { _id: -1 };
    }
    let res: Array<IAreaContabilida> = await Conta.readConta(
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
  public async getConta(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    let repres = await Conta.readConta(request.params.id);
    response.status(200).json(repres);
  }
  public async updateConta(request: Request, response: Response) {
     const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Conta: BussConta = new BussConta();
    let id: string = request.params.id;
    var params = request.body;
    var result:any = await Conta.readConta(id);
    if (!result) {
      response.status(300).json({ serverResponse: "area no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      var Result = await Conta.updateConta(id, params);
      console.log(params);
      response.status(300).json({ serverResponse: "se modifico" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/archivos`;
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
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["pdf"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      console.log(result.idCarpeta)
      var newname: string = `${"GAMB"}_${result.idCarpeta.area}_${result.idCarpeta.tipo}_${"N°"}${result.numero}_${
        result.idCarpeta.gestion
      }.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      params.archivo = newname;
      pathViejo = result.path;
      params.path = totalpath;
      if(totalpath!=result.path){
        borrarImagen(pathViejo);
      }
      params.uri = "getArchivo/" + newname;
      var Result = await Conta.updateConta(id, params);
      response.status(200).json({ serverResponse: "Conta modificado" });
      return;
    }
    response.status(200).json(result);
  }
  public async removeConta(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    let id: string = request.params.id;
    let result = await Conta.deleteConta(id);
    response.status(200).json({ serverResponse: "Se elimino la Conta" });
  }
  public async searchConta(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    var searchConta = request.params.search;
    let res = await Conta.searchConta(searchConta);
    response.status(200).json({ serverResponse: res });
  }
  //----------AREA------------//
  public async createArea(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    var AreaData = request.body;
    console.log("Area", AreaData);
    let result = await Area.addArea(AreaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getAreas(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.detalle != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter["nombre"] = nombre;
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
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    let resp: number = await Area.total({});
    var totalDocs = resp;
    var totalpage = Math.ceil(resp / limit);
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
    let res: Array<IArea> = await Area.readArea(
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
  public async getArea(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    let result = await Area.readArea(request.params.id);
    response.status(200).json(result);
  }
  public async updateArea(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Area.updateArea(id, params);
    response.status(200).json(result);
  }
  public async addTipo(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Area.addTipo(id, params);
    response.status(200).json(result);
  }
  public async removeTipo(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Area.removeTipo(id, params);
    response.status(200).json(result);
  }
  public async removeArea(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    let id: string = request.params.id;
    let result = await Area.deleteArea(id);
    response.status(200).json({ serverResponse: "Se elimino Area" });
  }
  public async searchArea(request: Request, response: Response) {
    var Area: BussArea = new BussArea();
    var searchArea = request.params.search;
    let res = await Area.searchArea(searchArea);
    response.status(200).json({ serverResponse: res });
  }
}
export default RoutesController;
