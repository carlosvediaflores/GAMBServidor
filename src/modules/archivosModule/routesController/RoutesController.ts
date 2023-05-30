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
class RoutesController {
    //* ---------------RENDICIONEs--------------*//
  public async getCarpetas(request: Request, response: Response) {
    var blogs: BussCarpeta = new BussCarpeta();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.estado != null) {
      filter["estado"] = status;
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
      blogs.readCarpeta(filter, skip, limit, order),
      blogs.total({}),
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
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Carpeta: BussCarpeta = new BussCarpeta();
    let id: string = request.params.id;
    let res = await Carpeta.readCarpeta(id);
    let result = await Carpeta.deleteCarpeta(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se eliminó la Carpeta" });
  }
  public async uploadCarpeta(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
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
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
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
      pathViejo = CarpetaToUpdate.path;
      filData.path = totalpath;
      if(totalpath!=CarpetaToUpdate.path){
        borrarImagen(pathViejo);
      }
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
    if (CarpetaData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(CarpetaData.path);
  }
  public async updateCarpeta(request: Request, response: Response) {
    var Carpeta: BussCarpeta = new BussCarpeta();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Carpeta.updateCarpeta(id, params);
    response.status(200).json({ res: "se editó" });
  }
}
export default RoutesController;