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
class RoutesController {
  //*--------------Slider------------------- *//
  public async createSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    var entidadData = request.body;
    let result = await entidad.addSlaider(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    const result: Array<ISlaider> = await entidad.readSlaiders();
    response.status(200).json(result);
  }
  public async getSlider(request: Request, response: Response) {
    var slider: BussSlaider = new BussSlaider();
    //let id: string = request.params.id;
    let res = await slider.readSlaiders(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  /*public async getSliders(request: Request, response: Response) {
    var slider: BussSlaider = new BussSlaider();
    var searchString = request.params.search;
    let res = await slider.readSliders(searchString);
    response.status(200).json({ serverResponse: res });
  }*/
  public async updateSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    let id: string = request.params.id;
    var params = request.body;
    var result = await entidad.updateSlaider(id, params);
    response.status(200).json(result);
  }
  public async removeSlaider(request: Request, response: Response) {
    var entidad: BussSlaider = new BussSlaider();
    let id: string = request.params.id;
    let result = await entidad.deleteSlaider(id);
    response.status(200).json({ serverResponse: "Se elimino con exito" });
  }
  public async uploadSlider(request: Request, response: Response) {
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
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var ext: string = "jpg";
        var newname: string = `${"GAMB"}_${filehash}.${ext}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
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
      var filehash: string = sha1(new Date().toString()).substr(0, 7);
      //var nameimg: string = file.name;
      //var extesplit = nameimg.split('\.');
      //var fileext: string = extesplit[1];
      var ext: string = "jpg";
      var newname: string = `${"GAMB"}_${filehash}.${ext}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.img = newname;
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
    let res = await post.readBlog(request.params.id);
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
    var blog: BussBlog = new BussBlog();
    let id: string = request.params.id;
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
    var postToUpdate: IBlog = await post.readBlog(id);
    if (!postToUpdate) {
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
        var resizedImage = processedImage.resize(1024, 768, {
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
        var nueva = `${'nuevaruta'}/${newname}`;
        fs.writeFileSync(totalpath, resizedImageBuffer)
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
      response.status(200).json({
        serverResponse: postResult,
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
      var extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.img = newname;
      filData.uri = "getimgpost/" + newname;
      filData.path = totalpath;
      filData.uri = "getgaceta/" + newname;
      var Result = await post.updateBlog(id, filData);
      response.status(200).json({ serverResponse: "Post modificado" });
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
      order = { _id: -1 };
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
      console.log(sluGaceta);
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
    var imgpost: BussImgpost = new BussImgpost();
    let id: string = request.params.id;
    let result = await imgpost.deleteImgpost(id);
    response.status(200).json({ serverResponse: "Se elimino la imgpost" });
  }
}
export default RoutesController;
