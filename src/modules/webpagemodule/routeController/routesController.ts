import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import slug from "slugify";
import sharp from "sharp";
const ObjectId = require("mongoose").Types.ObjectId;

import BussSlaider from "../bussinesController/slaider";
import { ISlaider } from "./../models/slaider";
import BussBlog from "../bussinesController/blog";
import { IBlog } from "./../models/blog";
import BussCategory from "../bussinesController/category";
import { ICategory } from "./../models/category";
import { IGaceta } from "../models/gaceta";
import BussGaceta from "../bussinesController/gaceta";
import { IPost } from "../models/imgpost";
import BussImgpost from "../bussinesController/imgpost";
import poa, { IPoa } from "../models/poa";
import BussPoa from "../bussinesController/poa";
import { IPtdi } from "../models/ptdi";
import BussPtdi from "../bussinesController/ptdi";
import { IArchivoPoa } from "../models/archivo_poa";
import BussArchivoPoa from "../bussinesController/archivo_poa";
import { IRendicion } from "../models/rendiciones";
import BussRendicion from "../bussinesController/rendiciones";
class RoutesController {
  //*--------------Slider------------------- *//
  public async createSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    var entidadData = request.body;
    let result = await entidad.addSlaider(entidadData);
    response.status(201).json({ serverResponse: result });
  }
  public async getSlaider(request: Request, response: Response) {
    var slider: BussSlaider = new BussSlaider();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.estado != null) {
      filter["estado"] = status;
    }
    if (params.titulo != null) {
      var expresion = new RegExp(params.titulo);
      filter["titulo"] = expresion;
    }
    /* if (params.numero != null) {
      var expresion = new RegExp(params.numero);
      filter["numero"] = expresion;
    }
    if (params.detalle != null) {
      var expresion = new RegExp(params.detalle);
      filter["detalle"] = expresion;
    } */
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
      order = { _id: -1 };
    }
    const [res, totalDocs] = await Promise.all([
      slider.readSlaiders(filter, skip, limit, order),
      slider.total({}),
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
  public async getSlider(request: Request, response: Response) {
    var slider: BussSlaider = new BussSlaider();
    //let id: string = request.params.id;
    let res = await slider.readSlaiders(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async updateSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    let id: string = request.params.id;
    var params = request.body;
    var result = await entidad.updateSlaider(id, params);
    response.status(200).json(result);
  }
  public async removeSlaider(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var slider: BussSlaider = new BussSlaider();
    let id: string = request.params.id;
    let res = await slider.readSlaiders(request.params.id);
    let result = await slider.deleteSlaider(id);
    pathViejo = res.patsslaider;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se elimino con exito" });
  }
  public async uploadSlider(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var slider: BussSlaider = new BussSlaider();
    var id: string = request.params.id;
    var sliderToUpdate: ISlaider = await slider.readSlaiders(id);
    if (!sliderToUpdate) {
      response.status(300).json({ serverResponse: "Slider no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await slider.updateSlaider(id, filData);
      response.status(200).json({ serverResponse: "Slider modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/sliders`;
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
      var sliderData = request.body;
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var processedImage = sharp(file.data);
        var resizedImage = processedImage.resize(1920, 800, {
          /*     fit: "contain",
          background: "#FFF", */
        });
        let resizedImageBuffer;
        try {
          resizedImageBuffer = await resizedImage.toBuffer();
        } catch (error) {
          console.log({ error });
        }
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${filehash}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        fs.writeFileSync(totalpath, resizedImageBuffer);
        //await copyDirectory(totalpath, file);
        sliderData.img = newname;
        sliderData.urislaider = "getimgslider/" + newname;
        sliderData.patsslaider = totalpath;
        var sliderResult: ISlaider = await slider.addSlaider(sliderData);
      }
      response.status(200).json({
        serverResponse: sliderResult,
      });
      return;
    }
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var processedImage = sharp(file.data);
      var resizedImage = processedImage.resize(1920, 800, {
        /*     fit: "contain",
          background: "#FFF", */
      });
      let resizedImageBuffer;
      try {
        resizedImageBuffer = await resizedImage.toBuffer();
      } catch (error) {
        console.log({ error });
      }
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      fs.writeFileSync(totalpath, resizedImageBuffer);
      //await copyDirectory(totalpath, file);
      filData.img = newname;
      pathViejo = sliderToUpdate.patsslaider;
      borrarImagen(pathViejo);
      filData.urislaider = "getimgslider/" + newname;
      filData.patsslaider = totalpath;
      var Result = await slider.updateSlaider(id, filData);
      response.status(200).json({ serverResponse: "Slider modificado" });
      return;
    }
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getImgslider(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var slider: BussSlaider = new BussSlaider();
    var sliderData: ISlaider = await slider.readSlider(name);
    if (!sliderData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (sliderData.patsslaider == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(sliderData.patsslaider);
  }
  //* ---------------Blog--------------*//
  public async createBlog(request: Request, response: Response) {
    var blog: BussBlog = new BussBlog();
    var blogData = request.body;
    let result = await blog.addBlog(blogData);
    response.status(201).json({ serverResponse: result });
  }

  public async getBlog(request: Request, response: Response) {
    var blog: BussBlog = new BussBlog();
    const result: Array<IBlog> = await blog.readBlog();
    response.status(200).json(result);
  }
  public async getBlogs(request: Request, response: Response) {
    var blogs: BussBlog = new BussBlog();
    var filter: any = {};
    var params: any = request.query;
    var status: boolean = true;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.status != null) {
      filter["status"] = status;
    }
    if (params.category != null) {
      var expresion = new RegExp(params.category);
      filter["category"] = expresion;
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
      order = { _id: -1 };
    }
    const [res, totalDocs] = await Promise.all([
      blogs.readBlog(filter, skip, limit, order),
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
  public async getPost(request: Request, response: Response) {
    var post: BussBlog = new BussBlog();
    //let id: string = request.params.id;
    let res = await post.readBlog(request.params.slug);
    response.status(200).json({ serverResponse: res });
  }
  public async getPostId(request: Request, response: Response) {
    var post: BussBlog = new BussBlog();
    //let id: string = request.params.id;
    let res = await post.readPostId(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async updateBlog(request: Request, response: Response) {
    var blog: BussBlog = new BussBlog();
    let id: string = request.params.id;
    var params = request.body;
    var result = await blog.updateBlog(id, params);
    response.status(200).json(result);
  }
  public async removeBlog(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var imgpost: BussImgpost = new BussImgpost();
    var blog: BussBlog = new BussBlog();
    let id: string = request.params.id;
    let res = await blog.readPostId(request.params.id);
    let imgs = res.imgs;
    imgs.forEach(async (data: any) => {
      let id = data._id;
      pathViejo = data.path;
      borrarImagen(pathViejo);
      let result = await imgpost.deleteImgpost(id);
    });
    let result = await blog.deleteBlog(id);
    response.status(200).json({ serverResponse: "Se elimino la blog" });
  }
  public async uploadPost(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var post: BussBlog = new BussBlog();
    var id: string = request.params.id;
    var postToUpdate: IBlog = await post.readPostId(id);
    if (!postToUpdate && id) {
      response.status(300).json({ serverResponse: "Post no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await post.updateBlog(id, filData);
      response.status(200).json({ serverResponse: "Post modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/post`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;
    var key: Array<string> = Object.keys(files);
    var fileData: Array<string> = files.images;
    var tam = fileData.length;
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
      let fil: BussImgpost = new BussImgpost();
      var postData1 = request.body;
      var postData = request.body;
      var slugPost = slug(postData1.title, { lower: true });
      postData1.slug = slugPost;
      var file: any;
      var postResult: IBlog = await post.addBlog(postData1);
      if (tam == undefined) {
        tam = 1;
        file = fileData;
      }
      for (var i = 0; i < tam; i++) {
        if (tam >= 2) {
          file = fileData[i];
        }
        var processedImage = sharp(file.data);
        var resizedImage = processedImage.resize(1024, 800, {
          fit: "contain",
          background: "#FFF",
        });
        let resizedImageBuffer;
        try {
          resizedImageBuffer = await resizedImage.toBuffer();
        } catch (error) {
          console.log({ error });
        }
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var newname: string = `${"GAMB"}_${filehash}${i}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        fs.writeFileSync(totalpath, resizedImageBuffer);
        //await copyDirectory(totalpath, file);
        postData.archivo = newname;
        postData.uri = "getimgpost/" + newname;
        postData.path = totalpath;
        let idPost = postResult._id;
        var result1 = await fil.addImgpost(postData);
        let idFile = result1._id;
        var result = await post.addImgs(idPost, idFile);
        if (result == null) {
          response
            .status(300)
            .json({ serverResponse: "no se pudo guardar..." });
          return;
        }
      }
    } else {
      let fil: BussImgpost = new BussImgpost();
      var filData: any = request.body;
      var filData1: any = request.body;
      let res = await post.readPostId(id);
      let imgs = res.imgs;
      imgs.forEach(async (data: any) => {
        let id = data._id;
        pathViejo = data.path;
        borrarImagen(pathViejo);
        let result = await fil.deleteImgpost(id);
      });
      var slugPost = slug(filData.title, { lower: true });
      filData.slug = slugPost;
      var file: any;
      var Result = await post.updateBlog(id, filData);
      if (tam == undefined) {
        tam = 1;
        file = fileData;
      }
      for (var i = 0; i < tam; i++) {
        if (tam >= 2) {
          file = fileData[i];
        }
        var processedImage = sharp(file.data);
        var resizedImage = processedImage.resize(1024, 800, {
          fit: "contain",
          background: "#FFF",
        });
        let resizedImageBuffer;
        try {
          resizedImageBuffer = await resizedImage.toBuffer();
        } catch (error) {
          console.log({ error });
        }
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${filehash}${i}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        fs.writeFileSync(totalpath, resizedImageBuffer);
        //await copyDirectory(totalpath, file);
        filData1.archivo = newname;
        filData1.uri = "getimgpost/" + newname;
        filData1.path = totalpath;
        var result1 = await fil.addImgpost(filData1);
        let idFile = result1._id;
        var result = await post.addImgs(id, idFile);
      }
      response.status(200).json({
        serverResponse: filData,
      });
      return;
    }

    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getImgPost(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var post: BussImgpost = new BussImgpost();
    var postData: IPost = await post.readImgpostFile(name);
    if (!postData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (postData.path == null) {
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(postData.path);
  }
  //* ---------------Category--------------*//
  public async createCategory(request: Request, response: Response) {
    var blog: BussCategory = new BussCategory();
    var blogData = request.body;
    let result = await blog.addCategory(blogData);
    response.status(201).json({ serverResponse: result });
  }

  public async getCategorys(request: Request, response: Response) {
    var blog: BussCategory = new BussCategory();
    const result: Array<ICategory> = await blog.readCategory();
    response.status(200).json(result);
  }
  public async getCategory(request: Request, response: Response) {
    var post: BussCategory = new BussCategory();
    //let id: string = request.params.id;
    let res = await post.readCategory(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async updateCategory(request: Request, response: Response) {
    var blog: BussCategory = new BussCategory();
    let id: string = request.params.id;
    var params = request.body;
    var result = await blog.updateCategory(id, params);
    response.status(200).json(result);
  }
  public async removeCategory(request: Request, response: Response) {
    var blog: BussCategory = new BussCategory();
    let id: string = request.params.id;
    let result = await blog.deleteCategory(id);
    response.status(200).json({ serverResponse: "Se elimino la blog" });
  }
  //* ---------------GACETA--------------*//
  public async getGacetas(request: Request, response: Response) {
    var blogs: BussGaceta = new BussGaceta();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.estado != null) {
      filter["estado"] = status;
    }
    if (params.titulo != null) {
      var expresion = new RegExp(params.titulo);
      filter["titulo"] = expresion;
    }
    /* if (params.numero != null) {
      var expresion = new RegExp(params.numero);
      filter["numero"] = expresion;
    }
    if (params.detalle != null) {
      var expresion = new RegExp(params.detalle);
      filter["detalle"] = expresion;
    } */
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
      order = { fecha: -1 };
    }
    const [res, totalDocs] = await Promise.all([
      blogs.readGaceta(filter, skip, limit, order),
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
  public async getGaceta(request: Request, response: Response) {
    var gaceta: BussGaceta = new BussGaceta();
    //let id: string = request.params.id;
    let res = await gaceta.readGaceta(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchGaceta(request: Request, response: Response) {
    var gaceta: BussGaceta = new BussGaceta();
    var searchString = request.params.search;
    let res = await gaceta.search(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async removeGaceta(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var gaceta: BussGaceta = new BussGaceta();
    let id: string = request.params.id;
    let res = await gaceta.readGaceta(id);
    let result = await gaceta.deleteGaceta(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se eliminó la gaceta" });
  }
  public async uploadGaceta(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var gaceta: BussGaceta = new BussGaceta();
    var id: string = request.params.id;
    var gacetaToUpdate: IGaceta = await gaceta.readGaceta(id);
    if (!gacetaToUpdate) {
      response.status(300).json({ serverResponse: "Gaceta no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await gaceta.updateGaceta(id, filData);
      response.status(200).json({ serverResponse: "Gaceta modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/gaceta`;
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
      var sluGaceta = slug(filData.numero);
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
        var newname: string = `${"GAMB"}_${sluGaceta}_${filehash}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getgaceta/" + newname;
        filData.path = totalpath;
        var sliderResult: IGaceta = await gaceta.addGaceta(filData);
      }
      response.status(200).json({
        serverResponse: sliderResult,
      });
      return;
    }
    var filData: any = request.body;
    var sluGaceta = slug(filData.numero);
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
      var newname: string = `${"GAMB"}_${sluGaceta}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      pathViejo = gacetaToUpdate.path;
      borrarImagen(pathViejo);
      filData.path = totalpath;
      filData.uri = "getgaceta/" + newname;
      var Result = await gaceta.updateGaceta(id, filData);
      response.status(200).json({ serverResponse: "gaceta modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getImgGaceta(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var gaceta: BussGaceta = new BussGaceta();
    var gacetaData: IGaceta = await gaceta.readGacetaFile(name);
    if (!gacetaData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      //response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (gacetaData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(gacetaData.path);
  }
  public async updateGaceta(request: Request, response: Response) {
    var gaceta: BussGaceta = new BussGaceta();
    let id: string = request.params.id;
    var params = request.body;
    var result = await gaceta.updateGaceta(id, params);
    response.status(200).json({ res: "se editó" });
  }
  //* ---------------IMGPOST--------------*//
  public async createImgpost(request: Request, response: Response) {
    var imgpost: BussImgpost = new BussImgpost();
    var imgpostData = request.body;
    let result = await imgpost.addImgpost(imgpostData);
    response.status(201).json({ serverResponse: result });
  }

  public async getImgposts(request: Request, response: Response) {
    var imgpost: BussImgpost = new BussImgpost();
    const result: Array<IPost> = await imgpost.readImgpost();
    response.status(200).json(result);
  }
  public async getImgpost(request: Request, response: Response) {
    var post: BussImgpost = new BussImgpost();
    //let id: string = request.params.id;
    let res = await post.readImgpost(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async updateImgpost(request: Request, response: Response) {
    var imgpost: BussImgpost = new BussImgpost();
    let id: string = request.params.id;
    var params = request.body;
    var result = await imgpost.updateImgpost(id, params);
    response.status(200).json(result);
  }
  public async removeImgpost(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var imgpost: BussImgpost = new BussImgpost();
    let id: string = request.params.id;
    let res = await imgpost.readImgpost(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let result = await imgpost.deleteImgpost(id);
    response.status(200).json({ serverResponse: "Se elimino la imgpost" });
  }
  //* ---------------POA--------------*//
  public async getPoas(request: Request, response: Response) {
    var blogs: BussPoa = new BussPoa();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.estado != null) {
      filter["estado"] = status;
    }
   /*  if (params.titulo != null) {
      var expresion = new RegExp(params.titulo);
      filter["titulo"] = expresion;
    }
    if (params.detalle != null) {
      var expresion = new RegExp(params.detalle);
      filter["detalle"] = expresion;
    } */
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
      filter["fecha"] = aux;
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
      blogs.readPoa(filter, skip, limit, order),
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
  public async getPoa(request: Request, response: Response) {
    var Poa: BussPoa = new BussPoa();
    //let id: string = request.params.id;
    let res = await Poa.readPoa(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchPoa(request: Request, response: Response) {
    var Poa: BussPoa = new BussPoa();
    var searchString = request.params.search;
    let res = await Poa.search(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async removePoa(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Poa: BussPoa = new BussPoa();
    let fil: BussArchivoPoa = new BussArchivoPoa();
    let id: string = request.params.id;
    let res = await Poa.readPoa(request.params.id);
    let poas = res.archivo;
    poas.forEach(async (data: any) => {
      let id = data._id;
      pathViejo = data.path;
      borrarImagen(pathViejo);
      let result = await fil.deleteArchivoPoa(id);
    });
    let result = await Poa.deletePoa(id);
    response.status(200).json({ serverResponse: "Se eliminó la Poa" });
  }
  public async uploadPoa(request: Request, response: Response) {
    var Poa: BussPoa = new BussPoa();
    var id: string = request.params.id;
    var PoaToUpdate: IPoa = await Poa.readPoa(id);
    if (!PoaToUpdate) {
      response.status(300).json({ serverResponse: "Poa no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await Poa.updatePoa(id, filData);
      response.status(200).json({ serverResponse: "Poa modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/plani`;
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
      let fil: BussArchivoPoa = new BussArchivoPoa();
      var poaData1 = request.body;
      var filData = request.body;
      //var sluPoa = slug(filData.titulo);
      var poaResult: IPoa = await Poa.addPoa(poaData1);
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
        var newname: string = `${"POA"}_${poaData1.descripcion}_${poaData1.gestion}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getpoa/" + newname;
        filData.path = totalpath;
        let idPoa = poaResult._id;
        var result1 = await fil.addArchivoPoa(filData);
        let idFile = result1._id;
        var result = await Poa.addArcivoPoa(idPoa, idFile);     
      }
      response.status(200).json({
        serverResponse: result,
      });
      return;
    }
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      let fil: BussArchivoPoa = new BussArchivoPoa();
      let poa = await Poa.readPoa(id)
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["pdf","xls","xlsx","docx","jpg"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"POA"}_${filData.descripcion}_${poa.gestion}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      filData.path = totalpath;
      filData.uri = "getpoa/" + newname;
      var result1 = await fil.addArchivoPoa(filData);
      let idFile = result1._id;
      var result = await Poa.addArcivoPoa(id, idFile);
      response.status(200).json({ serverResponse: "Poa modificado" });
      return;
    }
    
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getArchivoPoa(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Poa: BussArchivoPoa = new BussArchivoPoa();
    var PoaData: IArchivoPoa = await Poa.readArchivoPoaFile(name);
    if (!PoaData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      //response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (PoaData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(PoaData.path);
  }
  public async updatePoa(request: Request, response: Response) {
    var Poa: BussPoa = new BussPoa();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Poa.updatePoa(id, params);
    response.status(200).json({ res: "se editó" });  
  }
  //* ---------------ARCHIVO POA--------------*//
  public async deleteArchivoPoa(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var PoaArch: BussArchivoPoa = new BussArchivoPoa();
    let id: string = request.params.id;
    let res = await PoaArch.readArchivoPoa(id);
    let result = await PoaArch.deleteArchivoPoa(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se elimino" });
  }
  public async updateArchivoPoa(request: Request, response: Response) {
    var PoaArch: BussArchivoPoa = new BussArchivoPoa();
    let id: string = request.params.id;
    var params = request.body;
    var result = await PoaArch.updateArchivoPoa(id, params);
    response.status(200).json({ res: "se editó" });  
  }
  //* ---------------PTDI--------------*//
  public async getPtdis(request: Request, response: Response) {
    var blogs: BussPtdi = new BussPtdi();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.estado != null) {
      filter["estado"] = status;
    }
   /*  if (params.titulo != null) {
      var expresion = new RegExp(params.titulo);
      filter["titulo"] = expresion;
    }
    if (params.detalle != null) {
      var expresion = new RegExp(params.detalle);
      filter["detalle"] = expresion;
    } */
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
      filter["fecha"] = aux;
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
      blogs.readPtdi(filter, skip, limit, order),
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
  public async getPtdi(request: Request, response: Response) {
    var Ptdi: BussPtdi = new BussPtdi();
    //let id: string = request.params.id;
    let res = await Ptdi.readPtdi(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchPtdi(request: Request, response: Response) {
    var Ptdi: BussPtdi = new BussPtdi();
    var searchString = request.params.search;
    let res = await Ptdi.search(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async removePtdi(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Ptdi: BussPtdi = new BussPtdi();
    let id: string = request.params.id;
    let res = await Ptdi.readPtdi(id);
    let result = await Ptdi.deletePtdi(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se eliminó la Ptdi" });
  }
  public async uploadPtdi(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Ptdi: BussPtdi = new BussPtdi();
    var id: string = request.params.id;
    var PtdiToUpdate: IPtdi = await Ptdi.readPtdi(id);
    if (!PtdiToUpdate) {
      response.status(300).json({ serverResponse: "Ptdi no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await Ptdi.updatePtdi(id, filData);
      response.status(200).json({ serverResponse: "Ptdi modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/plani`;
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
      var sluPtdi = slug(filData.titulo);
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
        var newname: string = `${"GAMB"}_${sluPtdi}_${filehash}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getPtdi/" + newname;
        filData.path = totalpath;
        var sliderResult: IPtdi = await Ptdi.addPtdi(filData);
      }
      response.status(200).json({
        serverResponse: sliderResult,
      });
      return;
    }
    var filData: any = request.body;
    var sluPtdi = slug(filData.titulo);
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
      var newname: string = `${"GAMB"}_${sluPtdi}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      pathViejo = PtdiToUpdate.path;
      borrarImagen(pathViejo);
      filData.path = totalpath;
      filData.uri = "getPtdi/" + newname;
      var Result = await Ptdi.updatePtdi(id, filData);
      response.status(200).json({ serverResponse: "Ptdi modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getImgPtdi(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Ptdi: BussPtdi = new BussPtdi();
    var PtdiData: IPtdi = await Ptdi.readPtdiFile(name);
    if (!PtdiData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      //response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (PtdiData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(PtdiData.path);
  }
  public async updatePtdi(request: Request, response: Response) {
    var Ptdi: BussPtdi = new BussPtdi();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Ptdi.updatePtdi(id, params);
    response.status(200).json({ res: "se editó" });
  }
  //* ---------------RENDICIONEs--------------*//
  public async getRendicions(request: Request, response: Response) {
    var blogs: BussRendicion = new BussRendicion();
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
      blogs.readRendicion(filter, skip, limit, order),
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
  public async getRendicion(request: Request, response: Response) {
    var Rendicion: BussRendicion = new BussRendicion();
    //let id: string = request.params.id;
    let res = await Rendicion.readRendicion(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async searchRendicion(request: Request, response: Response) {
    var Rendicion: BussRendicion = new BussRendicion();
    var searchString = request.params.search;
    let res = await Rendicion.searchRendicion(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async removeRendicion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Rendicion: BussRendicion = new BussRendicion();
    let id: string = request.params.id;
    let res = await Rendicion.readRendicion(id);
    let result = await Rendicion.deleteRendicion(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Se eliminó la Rendicion" });
  }
  public async uploadRendicion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Rendicion: BussRendicion = new BussRendicion();
    var id: string = request.params.id;
    var RendicionToUpdate: IRendicion = await Rendicion.readRendicion(id);
    if (!RendicionToUpdate) {
      response.status(300).json({ serverResponse: "Rendicion no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await Rendicion.updateRendicion(id, filData);
      response.status(200).json({ serverResponse: "Rendicion modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/paginaWeb/plani`;
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
        var newname: string = `${"GAMB"}_${filData.descripcion}_${filData.gestion}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getrendicion/" + newname;
        filData.path = totalpath;
        var sliderResult: IRendicion = await Rendicion.addRendicion(filData);
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
      var newname: string = `${"GAMB"}_${filData.descripcion}_${filData.gestion}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      pathViejo = RendicionToUpdate.path;
      borrarImagen(pathViejo);
      filData.path = totalpath;
      filData.uri = "getrendicion/" + newname;
      var Result = await Rendicion.updateRendicion(id, filData);
      response.status(200).json({ serverResponse: "Rendicion modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  public async getFileRendicion(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Rendicion: BussRendicion = new BussRendicion();
    var RendicionData: IRendicion = await Rendicion.readRendicionFile(name);
    if (!RendicionData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      //response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (RendicionData.path == null) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      response.status(300).json({ serverResponse: "No existe imagen " });
      return;
    }
    response.sendFile(RendicionData.path);
  }
  public async updateRendicion(request: Request, response: Response) {
    var Rendicion: BussRendicion = new BussRendicion();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Rendicion.updateRendicion(id, params);
    response.status(200).json({ res: "se editó" });
  }
}
export default RoutesController;
