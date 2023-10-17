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

import carpeta, { ICarpeta } from "../models/carpeta";
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
    if (CarpetaData.cantidad != 0) {
      let num = parseInt(CarpetaData.cantidad);
      let numCarp = parseInt(CarpetaData.numCarpeta);
      for (let i = 0; i < num; i++) {
        CarpetaData["numCarpeta"] = numCarp + i;
        let result = await carpeta.addCarpeta(CarpetaData);
      }
      response
        .status(201)
        .json({
          serverResponse: `${"Se Creó "}${CarpetaData.cantidad}${" carpetas"}`,
        });
      return;
    } else {
      let result = await carpeta.addCarpeta(CarpetaData);
      response.status(201).json({ serverResponse: result });
    }
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
    if (params.subTipo != null) {
      var subTipo = new RegExp(params.subTipo, "i");
      filter["subTipo"] = subTipo;
    }
    if (params.gestion != null) {
      var gestion = new RegExp(params.gestion, "i");
      filter["gestion"] = gestion;
    }
    if (params.numCarpeta != null) {
      var numCarpeta: number = parseInt(params.numCarpeta);
      if (Number.isNaN(numCarpeta)) {
        filter["numCarpeta"];
      } else {
        filter["numCarpeta"] = numCarpeta;
      }
    }
    if (params.nameCarpeta != null) {
      var nameCarpeta = new RegExp(params.nameCarpeta, "i");
      filter["nameCarpeta"] = nameCarpeta;
    }
    if (params.estante != null) {
      var estante: number = parseInt(params.estante);
      if (Number.isNaN(estante)) {
        filter["estante"];
      } else {
        filter["estante"] = estante;
      }
    }
    if (params.lugar != null) {
      var lugar = new RegExp(params.lugar, "i");
      filter["lugar"] = lugar;
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
    let totalCarpeta: any = await carpeta.total(filter);
    var totalDocs = totalCarpeta;
    var totalpage = Math.ceil(totalCarpeta / limit);
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
      order = { gestion: -1, numCarpeta: 1 };
    }
    let res: Array<ICarpeta> = await carpeta.readCarpeta(
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
      order,
    });
    return;
  }
  //get carpeta con id
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
    response.status(200).json({ serverResponse: res, total:res.length});
  }
  public async removeCarpeta(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Carpeta: BussCarpeta = new BussCarpeta();
    var Conta: BussConta = new BussConta();
    let id: string = request.params.id;
    let res: any = await Carpeta.readCarpeta(id);
    let archivo: any = res.areaContabilidad;
    for (let i = 0; i < archivo.length; i++) {
      let data: any = archivo[i];
      pathViejo = data.path;
      borrarImagen(pathViejo);
      let removeArchivo = await Conta.deleteConta(data._id);
    }
    let result = await Carpeta.deleteCarpeta(id);
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
        filData.uri = "getArchivo/" + newname;
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
      filData.uri = "getArchivo/" + newname;
      var Result = await Carpeta.updateCarpeta(id, filData);
      response.status(200).json({ serverResponse: "Carpeta modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getFileArchivo(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Conta: BussConta = new BussConta();
    var ArchivoData: IAreaContabilida = await Conta.readContaFile(uri);
    if (!ArchivoData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(ArchivoData.path);
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
    //contaData.idCarpeta = idCarpeta;
    if(contaData.fojas==''){
      contaData.fojas = 0;
    }
    let result: any = {};
    let result1: any = {};
    if (isEmpty(request.files)) {
      if (area === "Contabilidad") {
        var resultArea: any = await conta.addConta(contaData);
        let idArea = resultArea._id;
        if (contaData.carpetas) {
          let partes:any = contaData.carpetas.split(",");
          let cantCarp = partes.length;
          for (let i = 0; i < cantCarp; i++) {
            let idArch = partes[i];
            let datos: any = { idCarpeta: idArch };
            var editCarpeta = await conta.updatePushConta(idArea, datos);
            result = await Carpeta.addContaId(idArch, idArea);
          }
          response
            .status(201)
            .json({
              serverResponse: `${"Se agregó a "}${
                contaData.carpetas.length
              }${" carpetas el archivo"}`
            });
          return;
        } else {
          let datos: any = { idCarpeta: idCarpeta };
          var editCarpeta = await conta.updatePushConta(idArea, datos);
          result = await Carpeta.addContaId(idCarpeta, idArea);
          response.status(201).json({ serverResponse: result });
          return;
        }
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
    //para area de contabilidad con file 
    if (area === "Contabilidad") {
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
        var newname: string = `${"GAMB"}_${area}_${
          carpetaResult.tipo
        }_${"Nro"}${contaData.numero}_${
          carpetaResult.gestion
        }.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        contaData.nameFile = newname;
        contaData.uri = "getArchivos/" + newname;
        contaData.path = totalpath;
        var resultArea = await conta.addConta(contaData);
      }
      let idArea = resultArea._id;
      //si existe carpetas 
      if (contaData.carpetas) {
        let partes:any = contaData.carpetas.split(",");
        let cantCarp = partes.length;
        for (let i = 0; i < cantCarp; i++) {
          let idArch = partes[i];
          let datos: any = { idCarpeta: idArch };
          var editCarpeta = await conta.updatePushConta(idArea, datos);
          result = await Carpeta.addContaId(idArch, idArea);
        }
        response
          .status(201)
          .json({
            serverResponse: `${"Se agregó a "}${
              contaData.carpetas.length
            }${" carpetas el archivo con file"}`
          });
        return;
      //si no existe carpetas 
      } else {
        let datos: any = { idCarpeta: idCarpeta };
        var editCarpeta = await conta.updatePushConta(idArea, datos);
        result = await Carpeta.addContaId(idCarpeta, idArea);
        response.status(201).json({ serverResponse: result });
        return;
      }
    }
    if (area === "Juridica") {
      /* result1 = await conta.addConta(contaData);
      let idArea = result1._id;
      result = await Carpeta.addContaId(idCarpeta, idArea); */
    }
    if (resultArea == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar" });
      return;
    }
    //response.status(200).json({ serverResponse: resultArea });
  }
  public async addArchivo(request: Request, response: Response) {
    let idCarpeta: string = request.params.id;
    var carpeta: BussCarpeta = new BussCarpeta();
    let Conta: BussConta = new BussConta();
    let idArchivo = request.body.archivo;
    let carpetaResult: any = await carpeta.readCarpeta(idCarpeta);
    if (!carpetaResult) {
      response.status(300).json({ serverResponse: "Carpeta no existe!" });
      return;
    }
    let area = carpetaResult.area;
    if (area === "Contabilidad") {
      var resultArea = await Conta.readConta(idArchivo);
      if (resultArea != null) {
        var checksub: any = carpetaResult.areaContabilidad.filter(
          (item: any) => {
            if (resultArea._id.toString() == item._id.toString()) {
              return true;
            }
            return false;
          }
        );
        if (checksub.length == 0) {
          let datos: any = { idCarpeta: idCarpeta };
          var editCarpeta = await Conta.updatePushConta(idArchivo, datos);
          var result = await carpeta.addContaId(idCarpeta, idArchivo);
          response.status(200).json({ serverResponse: resultArea });
          return;
        }
        response
          .status(300)
          .json({ serverResponse: "Ya existe el ARCHIVO en esta CARPETA" });
        return;
      }
    }
  }
  public async removeArchivo(request: Request, response: Response) {
    let idCarpeta: string = request.params.id;
    var carpeta: BussCarpeta = new BussCarpeta();
    let Conta: BussConta = new BussConta();
    let idArchivo = request.body.idArchivo;
    let carpetaResult: any = await carpeta.readCarpeta(idCarpeta);
    if (!carpetaResult) {
      response.status(300).json({ serverResponse: "Carpeta no existe!" });
      return;
    }
    let area = carpetaResult.area;
    if (area === "Contabilidad") {
      var resultArea = await Conta.readConta(idArchivo);
      if (resultArea != null) {
        var checksub: any = carpetaResult.areaContabilidad.filter(
          (item: any) => {
            if (resultArea._id.toString() == item._id.toString()) {
              return true;
            }
            return false;
          }
        );
        if (checksub.length != 0) {
          let datos: any = { idCarpeta: idCarpeta };
          var editCarpeta = await Conta.updateContaId(idArchivo, datos);
          var result = await carpeta.removeContaId(idCarpeta, idArchivo);
          response.status(200).json({ serverResponse: "Se movió el archivo" });
          return;
        }
        response
          .status(300)
          .json({ serverResponse: "Ya no existe el ARCHIVO en esta CARPETA" });
        return;
      }
    }
  }
  public async queryContaAll(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    var filter1: any = {};
    var filter2: any = {};
    var params: any = request.query;
    if (params.area != null) {
      var area = new RegExp(params.area, "i");
      filter1["area"] = area;
    }
    if (params.tipo != null) {
      var tipo = new RegExp(params.tipo, "i");
      filter1["tipo"] = tipo;
    }
    if (params.subTipo != null) {
      var subTipo = new RegExp(params.subTipo, "i");
      filter1["subTipo"] = subTipo;
    }
    if (params.gestion != null) {
      var gestion: number = parseInt(params.gestion);
      if (Number.isNaN(gestion)) {
        filter1["gestion"];
      } else {
        filter1["gestion"] = gestion;
      }      
    }
    if (params.glosa != null) {
      var glosa = new RegExp(params.glosa, "i");
      filter2["glosa"] = glosa;
    }
    if (params.beneficiario != null) {
      var beneficiario = new RegExp(params.beneficiario, "i");
      filter2["beneficiario"] = beneficiario;
    }
    if (params.numero != null) {
      var numero = new RegExp(params.numero, "i");
      filter2["numero"] = numero;
    }
    if (params.ci != null) {
      var ci = new RegExp(params.ci, "i");
      filter2["ci"] = ci;
    }
    let res = await Conta.queryContaAll(filter1, filter2);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  //----------CONTABILIDAD------------//
  public async createConta(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    var ContaData = request.body;
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
    if (params.glosa != null) {
      var glosa = new RegExp(params.glosa, "i");
      filter["glosa"] = glosa;
    }
    if (params.beneficiario != null) {
      var beneficiario = new RegExp(params.beneficiario, "i");
      filter["beneficiario"] = beneficiario;
    }
    if (params.numero != null) {
      var numero = new RegExp(params.numero, "i");
      filter["numero"] = numero;
    }
    if (params.fojas != null) {
      var fojas = new RegExp(params.fojas, "i");
      filter["fojas"] = fojas;
    }
    if (params.ci != null) {
      var ci = new RegExp(params.ci, "i");
      filter["ci"] = ci;
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
  //Archivos de conta sin asociar a una carpeta
  public async getContaSin(request: Request, response: Response) {
    var Conta: BussConta = new BussConta();
    let data:any = { idCarpeta: { $size: 0 } }
    let repres = await Conta.getContaSin(data);
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
    var result: any = await Conta.readConta(id);
    if (!result) {
      response.status(300).json({ serverResponse: "area no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      var Result = await Conta.updateConta(id, params);
      response.status(200).json({ serverResponse: "se modifico" });
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
      let carpeta = result.idCarpeta[0]

      var newname: string = `${"GAMB"}_${carpeta.area}_${
        carpeta.tipo
      }_${"Nro"}${result.numero}_${
        carpeta.gestion
      }.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      params.nameFile = newname;
      pathViejo = result.path;
      params.path = totalpath;
      if (totalpath != result.path) {
        borrarImagen(pathViejo);
      }
      params.uri = "getArchivos/" + newname;
      
      var Result = await Conta.updateConta(id, params);
      response.status(200).json({ serverResponse: "Conta modificado" });
      return;
    }
    response.status(200).json(result);
  }
  public async removeConta(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var carpeta: BussCarpeta = new BussCarpeta();
    var Conta: BussConta = new BussConta();
    let id: string = request.params.id;
    let res = await Conta.readConta(id);

    pathViejo = res.path;
    borrarImagen(pathViejo);
    let carperta=res.idCarpeta
    for(let i=0;i<carperta.length;i++){
      let idCarpeta:any = carperta[i]
      var resultCarpeta = await carpeta.removeContaId(idCarpeta, id);
    }
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
    let res: Array<IArea> = await Area.readArea(filter, skip, limit, order);
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
