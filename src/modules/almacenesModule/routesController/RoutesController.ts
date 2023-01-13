import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import slug from "slugify";
import sharp from "sharp";

import { ICategoria } from "../models/categorias";
import BussCategoria from "../businessController/categorias";
import { ISubCategoria } from "../models/sub_categorias";
import BussSubCategoria from "../businessController/sub_categorias";
import { IProveedor } from "../models/proveedores";
import BussProveedores from "../businessController/proveedores";
const ObjectId = require("mongoose").Types.ObjectId;
class RoutesController{
  //----------CATEGORIA------------//
  public async createCategoria(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    var categoriaData = request.body;
    let result = await Categoria.addCategoria(categoriaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getCategorias(request: Request, response: Response) {
    var categoria: BussCategoria = new BussCategoria();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.codigo != null) {
      var expresion = new RegExp(params.codigo);
      filter["codigo"] = expresion;
    }
    if (params.denominacion != null) {
      var expresion = new RegExp(params.denominacion);
      filter["denominacion"] = expresion;
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
    let respost: Array<ICategoria> = await categoria.readCategoria();
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
    let res: Array<ICategoria> = await categoria.readCategoria(
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
  public async getCategoria(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    let repres = await Categoria.readCategoria(request.params.id);
    response.status(200).json(repres);
  }
  public async getCategoriaCod(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    let codigo = request.params.codigo;
    let repres = await Categoria.readCategoriaCod(codigo);
    response.status(200).json(repres);
  }
  public async updateCategoria(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Categoria.updateCategoria(id, params);
    response.status(200).json(result);
  }
  public async removeCategoria(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    let id: string = request.params.id;
    let result = await Categoria.deleteCategoria(id);
    response.status(200).json({ serverResponse: "Se elimino la categoria" });
  }
   //----------SUB_CATEGORIA------------//
   public async createSubCategoria(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    var categoriaData = request.body;
    let result = await SubCategoria.addSubCategoria(categoriaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getSubCategorias(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.codigo != null) {
      var expresion = new RegExp(params.codigo);
      filter["codigo"] = expresion;
    }
    if (params.denominacion != null) {
      var expresion = new RegExp(params.denominacion);
      filter["denominacion"] = expresion;
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
    let respost: Array<ISubCategoria> = await SubCategoria.readSubCategoria();
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
    let res: Array<ISubCategoria> = await SubCategoria.readSubCategoria(
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
  public async getSubCategoria(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    let repres = await SubCategoria.readSubCategoria(request.params.id);
    response.status(200).json(repres);
  }
  public async getSubCategoriaCod(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    let codigo = request.params.codigo;
    let repres = await SubCategoria.readSubCategoriaCod(codigo);
    response.status(200).json(repres);
  }
  public async updateSubCategoria(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    let id: string = request.params.id;
    var params = request.body;
    var result = await SubCategoria.updateSubCategoria(id, params);
    response.status(200).json(result);
  }
  public async removeSubCategoria(request: Request, response: Response) {
    var SubCategoria: BussSubCategoria = new BussSubCategoria();
    let id: string = request.params.id;
    let result = await SubCategoria.deleteSubCategoria(id);
    response.status(200).json({ serverResponse: "Se elimino la subCategoria" });
  }
   //----------PROVEEDORES------------//
   public async createProveedores(request: Request, response: Response) {
    var proveedores: BussProveedores = new BussProveedores();
    var proveedorData = request.body;
    let result = await proveedores.addProveedor(proveedorData);
    response.status(201).json({ serverResponse: result });
  }
  public async getProveedoress(request: Request, response: Response) {
    var Proveedores: BussProveedores = new BussProveedores();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.codigo != null) {
      var expresion = new RegExp(params.codigo);
      filter["codigo"] = expresion;
    }
    if (params.denominacion != null) {
      var expresion = new RegExp(params.denominacion);
      filter["denominacion"] = expresion;
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
    let respost: Array<IProveedor> = await Proveedores.readProveedor();
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
    let res: Array<IProveedor> = await Proveedores.readProveedor(
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
  public async getProveedores(request: Request, response: Response) {
    var Proveedores: BussProveedores = new BussProveedores();
    let repres = await Proveedores.readProveedor(request.params.id);
    response.status(200).json(repres);
  }
  public async getProveedoresCod(request: Request, response: Response) {
    var proveedores: BussProveedores = new BussProveedores();
    let codigo = request.params.codigo;
    let repres = await proveedores.readProveedorCod(codigo);
    response.status(200).json(repres);
  }
  public async updateProveedores(request: Request, response: Response) {
    var proveedores: BussProveedores = new BussProveedores();
    let id: string = request.params.id;
    var params = request.body;
    var result = await proveedores.updateProveedor(id, params);
    response.status(200).json(result);
  }
  public async removeProveedores(request: Request, response: Response) {
    var proveedores: BussProveedores = new BussProveedores();
    let id: string = request.params.id;
    let result = await proveedores.deleteProveedor(id);
    response.status(200).json({ serverResponse: "Se elimino la Proveedores" });
  }
}
export default RoutesController;