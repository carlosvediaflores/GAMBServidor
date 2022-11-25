
import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";

import BussSlaider from '../bussinesController/slaider';
import { ISlaider} from './../models/slaider';
import BussBlog from "../bussinesController/blog";
import { IBlog } from './../models/blog';
import BussCategory from "../bussinesController/category";
import { ICategory } from './../models/category';
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
    if(isEmpty(request.files)){
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
    if (!id) {
      var sliderData = request.body;
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var ext: string = "jpg"
        var newname: string = `${'GAMB'}_${filehash}.${ext}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        sliderData.img = newname;
        sliderData.urislaider = "getimgslider/" + newname;
        sliderData.patsslaider = totalpath;
        var sliderResult: ISlaider = await slider.addSlaider(sliderData);
      }
      response
        .status(200)
        .json({
          serverResponse:
            sliderResult
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
      var ext: string = "jpg"
      var newname: string = `${'GAMB'}_${filehash}.${ext}`;
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
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
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
    if ( Object.entries(aux).length > 0) { 
      filter["createdAt"] = aux;
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
      blogs.readBlog(filter,
        skip,
        limit,
        order),
        blogs.total({})
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
    if(isEmpty(request.files)){
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
    if (!id) {
      var postData = request.body;
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var ext: string = "jpg"
        var newname: string = `${'GAMB'}_${filehash}.${ext}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        postData.img = newname;
        postData.uri = "getimgpost/" + newname;
        postData.path = totalpath;
        var sliderResult: IBlog = await post.addBlog(postData);
      }
      response
        .status(200)
        .json({
          serverResponse:
            sliderResult
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
      var ext: string = "jpg"
      var newname: string = `${'GAMB'}_${filehash}.${ext}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.img = newname;
      filData.uri = "getimgpost/" + newname;
      filData.path = totalpath;
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
    var post: BussBlog = new BussBlog();
    var postData: IBlog = await post.readPost(name);
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
}
export default RoutesController;