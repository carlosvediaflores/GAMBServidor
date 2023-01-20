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
import { IPrograma } from "../models/programa";
import BussPrograma from "../businessController/programa";
import { IProyecto } from "../models/proyecto";
import BussProyecto from "../businessController/proyecto";
import { IActividad } from "../models/actividad";
import BussActividad from "../businessController/actididad";
const ObjectId = require("mongoose").Types.ObjectId;
class RoutesController {
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
    var search: string | any;
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
  public async searchCat(request: Request, response: Response) {
    var convenio: BussCategoria = new BussCategoria();
    var searchCat = request.params.search;
    let res = await convenio.searchCat(searchCat);
    response.status(200).json({ serverResponse: res });
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
  public async searchSubCategoria(request: Request, response: Response) {
    var subCategoria: BussSubCategoria = new BussSubCategoria();
    var searchSubCategoria = request.params.search;
    let res = await subCategoria.searchSubCategoria(searchSubCategoria);
    response.status(200).json({ serverResponse: res });
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
  public async searchProveedor(request: Request, response: Response) {
    var proveedor: BussProveedores = new BussProveedores();
    var searchProveedor = request.params.search;
    let res = await proveedor.searchProveedor(searchProveedor);
    response.status(200).json({ serverResponse: res });
  }
  //----------PROGRAMA------------//
  public async createPrograma(request: Request, response: Response) {
    var Programa: BussPrograma = new BussPrograma();
    var ProgramaData = request.body;
    let year=new Date();
    ProgramaData["gestion"] = year.getFullYear()
    let result = await Programa.addPrograma(ProgramaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getProgramas(request: Request, response: Response) {
    var Programa: BussPrograma = new BussPrograma();
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
    let respost: Array<IPrograma> = await Programa.readPrograma();
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
    let res: Array<IPrograma> = await Programa.readPrograma(
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
  public async searchProg(request: Request, response: Response) {
    var convenio: BussPrograma = new BussPrograma();
    var searchProg = request.params.search;
    let res = await convenio.searchProg(searchProg);
    response.status(200).json({ serverResponse: res });
  }
  public async getPrograma(request: Request, response: Response) {
    var Programa: BussPrograma = new BussPrograma();
    let repres = await Programa.readPrograma(request.params.id);
    response.status(200).json(repres);
  }
  public async getProgramaCod(request: Request, response: Response) {
    var Programa: BussPrograma = new BussPrograma();
    let codigo = request.params.codigo;
    let repres = await Programa.readProgramaCod(codigo);
    response.status(200).json(repres);
  }
  public async updatePrograma(request: Request, response: Response) {
    var programa: BussPrograma = new BussPrograma();
    let id: string = request.params.id;
    var params = request.body;
    var result = await programa.updatePrograma(id, params);
    response.status(200).json(result);
  }
  public async removePrograma(request: Request, response: Response) {
    var programa: BussPrograma = new BussPrograma();
    let id: string = request.params.id;
    let result = await programa.deletePrograma(id);
    response.status(200).json({ serverResponse: "Se elimino el Registro" });
  }
  //----------PROYECTO------------//
  public async createProyecto(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    var Programa: BussPrograma = new BussPrograma();
    var ProyectoData = request.body;
    let idPrograma = ProyectoData.id_programa
    let programa = await Programa.readPrograma(idPrograma);
    ProyectoData["cat_prog"] = `${programa.codigo} ${ProyectoData.codigo} 000`
    let result = await Proyecto.addProyecto(ProyectoData);
    response.status(201).json({ serverResponse: result });
  }
  public async getProyectos(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    var filter: any = {};
    var search: string | any;
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
    let respost: Array<IProyecto> = await Proyecto.readProyecto();
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
    let res: Array<IProyecto> = await Proyecto.readProyecto(
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
  public async searchProy(request: Request, response: Response) {
    var convenio: BussProyecto = new BussProyecto();
    var searchProy = request.params.search;
    let res = await convenio.searchProy(searchProy);
    response.status(200).json({ serverResponse: res });
  }
  public async getProyecto(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    let repres = await Proyecto.readProyecto(request.params.id);
    response.status(200).json(repres);
  }
  public async getProyectoCod(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    let codigo = request.params.codigo;
    let repres = await Proyecto.readProyectoCod(codigo);
    response.status(200).json(repres);
  }
  public async updateProyecto(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Proyecto.updateProyecto(id, params);
    response.status(200).json(result);
  }
  public async removeProyecto(request: Request, response: Response) {
    var Proyecto: BussProyecto = new BussProyecto();
    let id: string = request.params.id;
    let result = await Proyecto.deleteProyecto(id);
    response.status(200).json({ serverResponse: "Se elimino el Registro" });
  }
  //----------ACTIVIDAD------------//
  public async createActividad(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    var Programa: BussPrograma = new BussPrograma();
    var ActividadData = request.body;
    let idPrograma = ActividadData.id_programa
    let programa = await Programa.readPrograma(idPrograma);
    ActividadData["cat_prog"] = `${programa.codigo} 000 ${ActividadData.codigo}`
    let result = await Actividad.addActividad(ActividadData);
    response.status(201).json({ serverResponse: result });
  }
  public async getActividades(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    var filter: any = {};
    var search: string | any;
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
    let respost: Array<IActividad> = await Actividad.readActividad();
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
    let res: Array<IActividad> = await Actividad.readActividad(
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
  public async searchActividad(request: Request, response: Response) {
    var convenio: BussActividad = new BussActividad();
    var searchActividad = request.params.search;
    let res = await convenio.searchActividad(searchActividad);
    response.status(200).json({ serverResponse: res });
  }
  public async getActividad(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    let repres = await Actividad.readActividad(request.params.id);
    response.status(200).json(repres);
  }
  public async getActividadCod(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    let codigo = request.params.codigo;
    let repres = await Actividad.readActividadCod(codigo);
    response.status(200).json(repres);
  }
  public async updateActividad(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Actividad.updateActividad(id, params);
    response.status(200).json(result);
  }
  public async removeActividad(request: Request, response: Response) {
    var Actividad: BussActividad = new BussActividad();
    let id: string = request.params.id;
    let result = await Actividad.deleteActividad(id);
    response.status(200).json({ serverResponse: "Se elimino el Registro" });
  }
}
export default RoutesController;
