import e, { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import slug from "slugify";
import sharp from "sharp";
import * as csv from "@fast-csv/parse";
import * as XLSX from "xlsx";
import { isValidObjectId } from "mongoose";
import { ICategoria } from "../models/categorias";
import BussCategoria from "../businessController/categorias";
import { ISubCategoria } from "../models/sub_categorias";
import BussSubCategoria from "../businessController/sub_categorias";
import { IProveedor } from "../models/proveedores";
import BussProveedores from "../businessController/proveedores";
import { IPrograma } from "../models/programa";
import BussPrograma from "../businessController/programa";
import proyecto, { IProyecto } from "../models/proyecto";
import BussProyecto from "../businessController/proyecto";
import { ISegPoa } from "../models/seg_poa";
import BussSegPoa from "../businessController/seg_poa";
import articulos, { IArticulo } from "../models/articulos";
import BussArticulo from "../businessController/articulos";
import { IMedida } from "../models/medidas";
import BussMedida from "../businessController/medidas";
import { IIngreso, ISimpleIngreso } from "../models/ingreso";
import BussIngreso from "../businessController/ingreso";
import { IEgreso } from "../models/egreso";
import BussEgreso from "../businessController/egreso";
import BussPartida from "../businessController/partidas";
import { ICompra } from "../models/compras";
import BussCompra from "../businessController/compras";
import { ISalida } from "../models/salida";
import BussSalida from "../businessController/salida";
import { IVale } from "../models/vale";
import BussVale from "../businessController/vale";
import { IAutorizacion } from "../models/autorizacion";
import BussAutorization from "../businessController/autotizacion";
import vehiculo, { IVehiculo } from "../models/vehiculo";
import BussVehiculo from "../businessController/vehiculo";
import { IFactura } from "../models/facturas";
import BussFactura from "../businessController/facturas";
import { log } from "console";
import BussPedidos from "../businessController/pedidos";
import { IPedidos } from "../models/pedidos";

const ObjectId = require("mongoose").Types.ObjectId;
class RoutesController {
  //----------CATEGORIA------------//
  public async createCategoria(request: Request, response: Response) {
    var Categoria: BussCategoria = new BussCategoria();
    //var Autorizacion: BussAutorization = new BussAutorization();
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
    response.status(200).json({ serverResponse: "Se elimino Proveedor" });
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
    let year = new Date();
    ProgramaData["gestion"] = year.getFullYear();
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
    let idPrograma = ProyectoData.id_programa;
    let programa = await Programa.readPrograma(idPrograma);
    ProyectoData["cat_prog"] = `${programa.codigo} ${ProyectoData.codigo} 000`;
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
  
  //////Seguimiento Poa-------//
  public async uploadExcelSegPoa(request: Request, response: Response) {
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var file: any = request.files.file;
    var dir = `${__dirname}/../../../../uploads`;
    var absolutepath = path.resolve(dir);
    var totalpath = `${absolutepath}/${"segPoa.xlsx"}`;
    console.log(totalpath);
    file.mv(totalpath, async (err: any, success: any) => {
      if (err) {
        response
          .status(300)
          .json({ serverResponse: "No se pudo almacenar el archivo" });
        return;
      }
      let xlFile = XLSX.readFile(totalpath);
      let sheet = xlFile.Sheets[xlFile.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(sheet);
      console.log(json);
      response.status(300).json({ serverResponse: "simpleUser" });
    });
  }
  public async uploadCsvPoa(request: Request, response: Response) {
    var segPoa: BussSegPoa = new BussSegPoa();
    var id: string = request.params.id;
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/csv`;
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
    var filData = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["csv"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      filData.uri = "getgaceta/" + newname;
      filData.path = totalpath;
      //csv
      let totalRecords: Array<any> = [];
      console.log(path.resolve(__dirname, totalpath));
      fs.createReadStream(path.resolve(__dirname, totalpath))
        .pipe(csv.parse({ headers: true, discardUnmappedColumns: true }))
        .on("error", (error) => console.error(error))
        .on("data", (row) => {
          totalRecords.push(row);
        })
        .on("end", async (rowCount: number) => {
          const result = await segPoa.addSegPoaCsv(totalRecords);
          console.log(`Parsed ${rowCount} rows`);
        });
    }
    response.status(200).json({
      serverResponse: "Se ejucutó con éxito",
    });
    return;
  }
  public async createSegPoa(request: Request, response: Response) {
    var segPoa: BussSegPoa = new BussSegPoa();
    var segPoaData = request.body;
    let result = await segPoa.addsegPoa(segPoaData);
    response.status(201).json({ serverResponse: result });
  }
  public async readSegPoa(request: Request, response: Response) {
    var segPoa: BussSegPoa = new BussSegPoa();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
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
    let respost: Array<ISegPoa> = await segPoa.readSegPoa();
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
    let res: Array<ISegPoa> = await segPoa.readSegPoa(
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
  public async searchSegPoa(request: Request, response: Response) {
    var segPoa: BussSegPoa = new BussSegPoa();
    var searchSegPoa = request.params.search;
    let res = await segPoa.searchSegPoa(searchSegPoa);
    response.status(200).json({ serverResponse: res });
  }
  public async getCatProg(request: Request, response: Response) {
    var segPoa: BussSegPoa = new BussSegPoa();
    let res = await segPoa.getCatProg();
    response.status(200).json({ serverResponse: res });
  }
  //----------ARTICULO------------//
  public async createArticulo(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    var ArticuloData = request.body;
    let result = await Articulo.addArticulo(ArticuloData);
    response.status(201).json({ serverResponse: result });
  }
  public async getArticuloNombre(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    var filter: any = {};
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = { _id: -1 };
    var params: any = request.query;
    if (params.nombre != null) {
      var expresion = new RegExp(params.nombre);
      const decodedQuery = unescape(params.nombre);
      filter["nombre"] = decodedQuery;
    }
    console.log(filter);
    let res: Array<IArticulo> = await Articulo.readArticulo(
      filter,
      skip,
      limit,
      order
    );
    response.status(200).json({
      serverResponse: res,
    });
    return;
  }
  public async getArticulos(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = { _id: -1 };
    var select = "";
    if (params.codigo != null) {
      var expresion = new RegExp(params.codigo);
      filter["codigo"] = expresion;
    }
    if (params.nombre != null) {
      var expresion = new RegExp(params.nombre, "i");
      const escaped = new RegExp(
        params.nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter["nombre"] = escaped;
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
    let respost: Array<IArticulo> = await Articulo.readArticulo();
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
    let res: Array<IArticulo> = await Articulo.readArticulo(
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
  public async searchArticulo(request: Request, response: Response) {
    var convenio: BussArticulo = new BussArticulo();
    var searchArticulo = request.params.search;
    const searchValue = decodeURIComponent(searchArticulo);
    const escapedSearchValue = searchValue.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const escaped = new RegExp(escapedSearchValue, "i");
    let res = await convenio.searchArticulo(escaped);
    response.status(200).json({ serverResponse: res });
  }
  public async searchArticulos(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    var searchArticulos = request.params.search;
    let res = await Articulo.searchArticulos(searchArticulos);
    response.status(200).json({ serverResponse: res });
  }
  public async getArticulo(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    let result = await Articulo.readArticulo(request.params.id);
    response.status(200).json(result);
  }
  public async getArticuloCod(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    let codigo = request.params.codigo;
    let result = await Articulo.readArticuloCod(codigo);
    response.status(200).json(result);
  }
  public async updateArticulo(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Articulo.updateArticulo(id, params);
    response.status(200).json(result);
  }
  public async removeArticulo(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    let id: string = request.params.id;
    let result = await Articulo.deleteArticulo(id);
    response.status(200).json({ serverResponse: "Se elimino Articulo" });
  }
  //----------MEIDIDAs------------//
  public async createMedida(request: Request, response: Response) {
    var Medida: BussMedida = new BussMedida();
    var MedidaData = request.body;
    let result = await Medida.addMedida(MedidaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getMedidas(request: Request, response: Response) {
    var Medida: BussMedida = new BussMedida();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
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
    let respost: Array<IMedida> = await Medida.readMedida();
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
    let res: Array<IMedida> = await Medida.readMedida(
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
  public async getMedida(request: Request, response: Response) {
    var Medida: BussMedida = new BussMedida();
    let repres = await Medida.readMedida(request.params.id);
    response.status(200).json(repres);
  }
  public async updateMedida(request: Request, response: Response) {
    var Medida: BussMedida = new BussMedida();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Medida.updateMedida(id, params);
    response.status(200).json(result);
  }
  public async removeMedida(request: Request, response: Response) {
    var Medida: BussMedida = new BussMedida();
    let id: string = request.params.id;
    let result = await Medida.deleteMedida(id);
    response.status(200).json({ serverResponse: "Se elimino la Medida" });
  }
  public async searchMedida(request: Request, response: Response) {
    var medida: BussMedida = new BussMedida();
    var searchMedida = request.params.search;
    let res = await medida.searchMedida(searchMedida);
    response.status(200).json({ serverResponse: res });
  }
  //----------INGRESO------------//
  public async createIngreso(request: Request, response: Response) {
    var compra: BussCompra = new BussCompra();
    var Ingreso: BussIngreso = new BussIngreso();
    var Articulo: BussArticulo = new BussArticulo();
    var IngresoData = request.body;
    let result: any;
    const resp: any = await Ingreso.getNumIngreso();
    if (isEmpty(resp)) {
      IngresoData["numeroEntrada"] = 1;
      result = await Ingreso.addIngreso(IngresoData);
    } else {
      const resp1: any = resp[0];
      let num = resp1.numeroEntrada + 1;
      IngresoData["numeroEntrada"] = num;
      result = await Ingreso.addIngreso(IngresoData);
    }
    for (let i = 0; i < IngresoData.articulos.length; i++) {
      let data = IngresoData.articulos[i];
      let articulo = await Articulo.readArticulo(data.idArticulo);
      let stock: Number = articulo.cantidad + parseInt(data.cantidadCompra);
      var params: any = request.body;
      let compraData: any = request.body;
      params["cantidad"] = stock;
      compraData["idEntrada"] = result._id;
      compraData["idArticulo"] = data.idArticulo;
      compraData["idProducto"] = data.idArticulo;
      compraData["catProgra"] = data.catProgra;
      compraData["factura"] = data.factura;
      compraData["cantidadCompra"] = data.cantidadCompra;
      compraData["stockCompra"] = data.cantidadCompra;
      compraData["ubicacion"] = data.ubicacion;
      compraData["precio"] = data.precio;
      let resultCompra = await compra.addCompra(compraData);
      let idCompra = resultCompra._id;
      var resultAdd = await Ingreso.addCompras(result._id, idCompra);
      let result1 = await Articulo.updateArticulo(articulo.id, params);
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getIngresos(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var filter1: any = {};
    var filter2: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.concepto != null) {
      var concepto = new RegExp(params.concepto, "i");
      filter1["concepto"] = concepto;
    }
    if (params.numeroEntrada != null) {
      var numeroEntrada: number = parseInt(params.numeroEntrada);
      if (Number.isNaN(numeroEntrada)) {
        filter1["numeroEntrada"];
      } else {
        filter1["numeroEntrada"] = numeroEntrada;
      }
    }
    if (params.estado != null) {
      var estado = new RegExp(params.estado, "i");
      filter1["estado"] = estado;
    }
    if (params.tipo != null) {
      var tipo = new RegExp(params.tipo, "i");
      filter1["tipo"] = tipo;
    }
    if (params.del != null) {
      var gt = params.del;
      aux["$gt"] = gt;
    }
    if (params.al != null) {
      var lt = params.al;
      aux["$lte"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter1["fecha"] = aux;
    }
    if (params.idProve != null) {
      let idProve = params.idProve;
      if (!ObjectId.isValid(idProve)) {
        filter2["_id"] = "";
      } else {
        filter2["_id"] = idProve;
      }
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    let respost: any = await Ingreso.totales(filter1, filter2);
    var totalDocs = respost.length;
    var totalpage = Math.ceil(totalDocs / limit);
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
    let res = await Ingreso.readIngresos(filter1, filter2, skip, limit, order);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
    });
    return;
  }
  public async searchIngreso(request: Request, response: Response) {
    var convenio: BussIngreso = new BussIngreso();
    var searchIngreso = request.params.search;
    let res = await convenio.searchIngreso(searchIngreso);
    response.status(200).json({ serverResponse: res });
  }
  public async getIngreso(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    let repres = await Ingreso.readIngreso(request.params.id);
    response.status(200).json(repres);
  }
  public async queryIngresoPersona(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var quieryIngreso = request.params.search;
    let res = await Ingreso.queryIngresoPersona(quieryIngreso);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async queryIngresoProveedor(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var quieryIngreso = request.params.search;
    let res = await Ingreso.queryIngresoProveedor(quieryIngreso);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async queryIngresoCompra(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var quieryIngreso = request.params.search;
    let res = await Ingreso.queryIngresoCompra(quieryIngreso);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async updateIngreso(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var compra: BussCompra = new BussCompra();
    var salida: BussSalida = new BussSalida();
    var Articulo: BussArticulo = new BussArticulo();
    var Egreso: BussEgreso = new BussEgreso();
    let id: string = request.params.id;
    var params = request.body;
    let res = await Ingreso.readIngreso(id);
    let productos: any = params.articulos;
    for (let i = 0; i < productos.length; i++) {
      let data: any = productos[i];
      //console.log("params",data)
      let articulo = await Articulo.readArticulo(data.idArticulo);
      let articuloModif: any = {};
      let compraModif: any = {};
      let salidaM: any = {};
      if (data.idCompra) {
        let listCompra: ICompra = await compra.readCompra(data.idCompra);
        let sumStock = parseInt(data.cantidadCompra) + listCompra.stockCompra;
        let sumArticulo = parseInt(data.cantidadCompra) + articulo.cantidad;
        let listIngreso: any = listCompra.idEntrada;
        if (listIngreso.estado == "EGRESADO") {
          data.cantidadSalida = data.cantidadCompra;
          let resultEditS = await salida.updateSalida(
            listCompra.salidas[0]._id,
            data
          );
        } else {
          if (listCompra.cantidadCompra <= sumStock) {
            let stockAct = sumStock - listCompra.cantidadCompra;
            let stock: Number = sumArticulo - listCompra.cantidadCompra;
            articuloModif["cantidad"] = stock;
            data.stockCompra = stockAct;
            if (stockAct > 0) {
              data.estadoCompra = "EXISTE";
            } else {
              data.estadoCompra = "AGOTADO";
            }
          } else {
            response.status(300).json({
              serverResponse:
                "No puede reducir la cantidad de entrda, motivivo q ya salieron en su totalidad",
            });
            return;
          }
        }
        await Articulo.updateArticulo(articulo.id, articuloModif);
        let resultEdit = await compra.updateCompra(listCompra._id, data);
      } else {
        data.idEntrada = id;
        data.idProducto = data.idArticulo;
        let resultCompra = await compra.addCompra(data);
        let idCompra = resultCompra._id;
        var resultAdd = await Ingreso.addCompras(id, idCompra);
        if (res.estado == "EGRESADO") {
          salidaM["cantidadSalida"] = data.cantidadCompra;
          salidaM["estadoSalida"] = "SIN OBS";
          salidaM["catProgra"] = data.catProgra;
          salidaM["idCompra"] = idCompra;
          salidaM["idEgreso"] = res.idEgreso[0]._id;
          compraModif["stockCompra"] = 0;
          compraModif["estadoCompra"] = "AGOTADO";
          let resultSalida = await salida.addSalida(salidaM);
          let idSalida = resultSalida._id;
          await Egreso.addSalidas(res.idEgreso[0]._id, idSalida);
          var compraAdd = await compra.addSalidas(idCompra, idSalida);
          let result2 = await compra.updateCompra(data._id, compraModif);
        } else {
          let sumArticulo = parseInt(data.cantidadCompra) + articulo.cantidad;
          articuloModif["cantidad"] = sumArticulo;
          await Articulo.updateArticulo(articulo.id, articuloModif);
        }
      }
    }
    var result = await Ingreso.updateIngreso(id, params);
    response.status(200).json(result);
  }
  public async removeIngreso(request: Request, response: Response) {
    var Ingreso: BussIngreso = new BussIngreso();
    var Articulo: BussArticulo = new BussArticulo();
    var compra: BussCompra = new BussCompra();
    var salida: BussSalida = new BussSalida();
    var egreso: BussEgreso = new BussEgreso();
    let id: string = request.params.id;
    let entrada = await Ingreso.readIngreso(id);
    var egresoData = request.body;
    let productos: any = entrada.productos;
    if (entrada.estado === "REGISTRADO") {
      for (let i = 0; i < productos.length; i++) {
        let data: any = productos[i];
        let SimpleArt: any = await Articulo.readArticulo(data.idArticulo._id);
        let ArticuloSimple: any = SimpleArt[0];
        let stock: Number = ArticuloSimple.cantidad - data.cantidadCompra;
        egresoData.cantidad = stock;
        let result1 = await Articulo.updateArticulo(
          data.idArticulo._id,
          egresoData
        );
        let removeCompra = await compra.deleteCompra(data._id);
      }
      let result = await Ingreso.deleteIngreso(id);
      response.status(200).json({ serverResponse: "Se elimino Ingreso" });
      return;
    }
    for (let i = 0; i < productos.length; i++) {
      let data: any = productos[i];
      //let SimpleArt: any = await Articulo.readArticulo(data.idArticulo._id)
      //let ArticuloSimple: any = SimpleArt[0]
      //let stock: Number = ArticuloSimple.cantidad + data.cantidadCompra;
      //egresoData.cantidad = stock;
      let result1 = await Articulo.updateArticulo(
        data.idArticulo._id,
        egresoData
      );
      let removeCompra = await compra.deleteCompra(data._id);
    }
    let salidas: any = entrada.idEgreso;
    for (let j = 0; j < salidas.length; j++) {
      let dataSalida = salidas[j];
      let productoSal: any = dataSalida.productos;
      for (let k = 0; k < productoSal.length; k++) {
        let productoSalida = productoSal[k];
        let removeSalida = await salida.deleteSalida(productoSalida);
      }
      let removeEgreso = await egreso.deleteEgreso(dataSalida._id);
    }
    let result = await Ingreso.deleteIngreso(id);
    response.status(200).json({ serverResponse: "Se elimino Ingreso" });
  }
  //----------EGRESO------------//
  public async createEgreso(request: Request, response: Response) {
    var Egreso: BussEgreso = new BussEgreso();
    var compra: BussCompra = new BussCompra();
    var salida: BussSalida = new BussSalida();
    var ingreso: BussIngreso = new BussIngreso();
    var articulo: BussArticulo = new BussArticulo();
    var EgresoData = request.body;
    let result: any;
    const resp: any = await Egreso.getNumEgreso();
    if (isEmpty(resp)) {
      EgresoData["numeroSalida"] = 1;
      result = await Egreso.addEgreso(EgresoData);
    } else {
      let num = resp.numeroSalida + 1;
      EgresoData["numeroSalida"] = num;
      EgresoData["glosaSalida"] = EgresoData.concepto;
      result = await Egreso.addEgreso(EgresoData);
    }
    for (let i = 0; i < EgresoData.articulos.length; i++) {
      let data = EgresoData.articulos[i];
      let listCompra = await compra.readCompra(data.idCompra);
      let entrada: any = listCompra.idEntrada;
      let Simplearticulo: any = listCompra.idArticulo;
      EgresoData.cantidadSalida = data.cantidadSalida;
      EgresoData.idCompra = data.idCompra;
      EgresoData.catProgra = data.catProgra;
      EgresoData.idEgreso = result._id;
      let resultSalida = await salida.addSalida(EgresoData);
      let idSalida = resultSalida._id;
      var resultAdd = await Egreso.addSalidas(result._id, idSalida);
      var compraAdd = await compra.addSalidas(data.idCompra, idSalida);
      let stock: Number = Simplearticulo.cantidad - EgresoData.cantidadSalida;
      let stockCompra: Number =
        listCompra.stockCompra - EgresoData.cantidadSalida;
      EgresoData.stockCompra = stockCompra;
      EgresoData.cantidad = stock;
      if (stockCompra === 0) {
        EgresoData.estadoCompra = "AGOTADO";
      } else {
        EgresoData.estadoCompra = "EXISTE";
      }
      let result1 = await articulo.updateArticulo(
        Simplearticulo._id,
        EgresoData
      );
      let resultCompra = await compra.updateCompra(data.idCompra, EgresoData);
      const ENTRADA: ISimpleIngreso = {
        estado: "SALIDA",
      };
      var resul = await ingreso.updateIngreso(entrada._id, ENTRADA);
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getEgresos(request: Request, response: Response) {
    var Egreso: BussEgreso = new BussEgreso();
    var filter: any = {};
    var filter2: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.glosaSalida != null) {
      var glosaSalida = new RegExp(params.glosaSalida, "i");
      filter["glosaSalida"] = glosaSalida;
    }
    if (params.numeroSalida != null) {
      var numeroSalida: number = parseInt(params.numeroSalida);
      if (Number.isNaN(numeroSalida)) {
        filter["numeroSalida"];
      } else {
        filter["numeroSalida"] = numeroSalida;
      }
    }
    if (params.entregado != null) {
      var entregado = new RegExp(params.entregado, "i");
      filter["entregado"] = entregado;
    }
    if (params.cargo != null) {
      var cargo = new RegExp(params.cargo, "i");
      filter["cargo"] = cargo;
    }
    if (params.del != null) {
      var gt = params.del;
      aux["$gt"] = gt;
    }
    if (params.al != null) {
      var lt = params.al;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fecha"] = aux;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    let respost: any = await Egreso.totales(filter);
    var totalDocs = respost.length;
    var totalpage = Math.ceil(totalDocs / limit);
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
    let res: Array<IEgreso> = await Egreso.readEgresos(
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
  public async searchEgreso(request: Request, response: Response) {
    var convenio: BussEgreso = new BussEgreso();
    var searchEgreso = request.params.search;
    let res = await convenio.searchEgreso(searchEgreso);
    response.status(200).json({ serverResponse: res });
  }
  public async getEgreso(request: Request, response: Response) {
    var Egreso: BussEgreso = new BussEgreso();
    let listEgreso = await Egreso.readEgreso(request.params.id);
    response.status(200).json(listEgreso);
  }
  public async updateEgreso(request: Request, response: Response) {
    var Egreso: BussEgreso = new BussEgreso();
    var compra: BussCompra = new BussCompra();
    var salida: BussSalida = new BussSalida();
    var articulo: BussArticulo = new BussArticulo();
    let id: string = request.params.id;
    var params = request.body;
    for (let i = 0; i < params.articulos.length; i++) {
      let data = params.articulos[i];
      let listCompra = await compra.readCompra(data.idCompra);
      let listSalida = await salida.readSalida(data.idSalida);
      let listArticulo = await articulo.readArticulo(data.idArticulo);
      let sumStock = listSalida.cantidadSalida + listCompra.stockCompra;
      let sumCantidad = listArticulo.cantidad + listSalida.cantidadSalida;
      if (sumStock >= data.cantidadCompra) {
        data.cantidadSalida = data.cantidadCompra;
        data.stockCompra = sumStock - data.cantidadCompra;
        data.cantidad = sumCantidad - data.cantidadCompra;
        if (data.stockCompra <= 0) {
          data.estadoCompra = "AGOTADO";
        } else {
          data.estadoCompra = "EXISTE";
        }
      } else {
        response.status(300).json({
          serverResponse: `La Cantidad de este artículo ya no existe en Stock, Stock: ${listCompra.stockCompra}`,
        });
        return;
      }
      delete data.cantidadCompra;
      let result1 = await articulo.updateArticulo(data.idArticulo, data);
      let resultCompra = await compra.updateCompra(data.idCompra, data);
      let resultSalida = await salida.updateSalida(data.idSalida, data);
    }
    var result = await Egreso.updateEgreso(id, params);
    response.status(200).json(result);
  }
  public async removeEgreso(request: Request, response: Response) {
    var Egreso: BussEgreso = new BussEgreso();
    var Articulo: BussArticulo = new BussArticulo();
    var salida: BussSalida = new BussSalida();
    var compra: BussCompra = new BussCompra();
    let idEgreso: string = request.params.id;
    let listEgreso: any = await Egreso.readEgreso(request.params.id);
    let listProductos: any = listEgreso.productos;
    var updateData = request.body;
    // console.log("List Egreso",listProductos)
    if (listEgreso == null) {
      response.status(300).json({ serverResponse: "No existe ingreso" });
      return;
    }
    if (listEgreso.estadoEgreso === "DIRECTO") {
      response.status(300).json({
        serverResponse:
          "Este salida debe eliminar desde el ingreso N°" +
          " " +
          listEgreso.idIngreso.numeroEntrada,
      });
      return;
    }
    for (let i = 0; i < listProductos.length; i++) {
      let data: any = listProductos[i];
      let SimpleArt: any = await Articulo.readArticulo(
        data.idCompra.idArticulo._id
      );
      let ArticuloSimple: any = SimpleArt[0];
      let totalCompra: Number = data.cantidadSalida + data.idCompra.stockCompra;
      let totalCantidad: Number = ArticuloSimple.cantidad + data.cantidadSalida;
      if (data.idCompra.stockCompra === 0) {
        updateData.estadoCompra = "EXISTE";
      }
      updateData.stockCompra = totalCompra;
      updateData.cantidad = totalCantidad;
      let result1 = await Articulo.updateArticulo(
        ArticuloSimple._id,
        updateData
      );
      let resultCompra = await compra.updateCompra(
        data.idCompra._id,
        updateData
      );
      let removeSalida = await compra.removeIdSalida(
        data.idCompra._id,
        data._id
      );
      let deleteSalida = await salida.deleteSalida(data._id);
    }
    let result = await Egreso.deleteEgreso(idEgreso);
    response.status(200).json({ productos: listEgreso.productos });
  }
  ///PARTIDA ALMACEN
  public async createPartida(request: Request, response: Response) {
    var count: BussPartida = new BussPartida();
    const res: any = await count.partidasAlm();
    let result: any;
    if (isEmpty(res)) {
      var countData = request.body;
      result = await count.addPartida(countData);
    } else {
      const resp: any = res[0];
      let id: string = resp._id;
      var params: any = request.body;
      params["visitas"] = resp.visitas + 1;
      result = await count.updatePartida(id, params);
    }
    response.status(201).json({ serverResponse: result });
  }
  public async partidasAlm(request: Request, response: Response) {
    var count: BussPartida = new BussPartida();
    let res = await count.partidasAlm();
    response.status(200).json(res);
  }
  public async egreso(request: Request, response: Response) {
    let idIng: string = request.params.id;
    var ingreso: BussIngreso = new BussIngreso();
    var Egreso: BussEgreso = new BussEgreso();
    var Articulo: BussArticulo = new BussArticulo();
    var compra: BussCompra = new BussCompra();
    var salida: BussSalida = new BussSalida();
    let res = await ingreso.readIngreso(idIng);
    if (res == null) {
      response.status(300).json({ serverResponse: "No existe ingreso" });
      return;
    }
    if (res.estado == "EGRESADO") {
      response.status(300).json({
        serverResponse:
          "Este Ingreso ya fue reguistrado su Egreso en su totalidad",
      });
      return;
    }
    var egresoData = request.body;
    if (!egresoData.idPersona) {
      egresoData["idPersona"] = res.idPersona;
    }
    egresoData["articulos"] = res.productos;
    egresoData["idProveedor"] = res.idProveedor;
    egresoData["idUsuario"] = res.idUsuario;
    egresoData["estadoEgreso"] = "DIRECTO";
    egresoData["idIngreso"] = idIng;
    egresoData["fecha"] = egresoData.fechaSalida;
    let result: any;
    const resp: any = await Egreso.getNumEgreso();
    if (isEmpty(resp)) {
      egresoData["numeroSalida"] = 1;
      result = await Egreso.addEgreso(egresoData);
    } else {
      let num = resp.numeroSalida + 1;
      egresoData["numeroSalida"] = num;
      result = await Egreso.addEgreso(egresoData);
    }
    for (let i = 0; i < res.productos.length; i++) {
      let data: any = res.productos[i];
      let SimpleArt: any = await Articulo.readArticulo(data.idArticulo._id);
      let ArticuloSimple: any = SimpleArt[0];
      let stock: Number =
        ArticuloSimple.cantidad - parseInt(data.cantidadCompra);
      egresoData.cantidadSalida = data.cantidadCompra;
      egresoData.estadoSalida = "SIN OBS";
      egresoData.catProgra = data.catProgra;
      egresoData.idCompra = data._id;
      egresoData.idEgreso = result._id;
      egresoData.cantidad = stock;
      egresoData.estadoCompra = "AGOTADO";
      egresoData.stockCompra = 0;
      egresoData.cantidad = stock;
      let resultSalida = await salida.addSalida(egresoData);
      let idSalida = resultSalida._id;
      var resultAdd = await Egreso.addSalidas(result._id, idSalida);
      var compraAdd = await compra.addSalidas(data._id, idSalida);
      let result1 = await Articulo.updateArticulo(
        data.idArticulo._id,
        egresoData
      );
      let result2 = await compra.updateCompra(data._id, egresoData);
    }
    const ENTRADA: ISimpleIngreso = {
      estado: "EGRESADO",
    };
    var egresoAdd = await ingreso.addEgresos(idIng, result._id);
    var resul = await ingreso.updateIngreso(idIng, ENTRADA);
    response.status(201).json({ serverResponse: result });
  }
  //----------COMPRAS------------//
  public async createCompra(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var CompraData = request.body;
    let result = await Compra.addCompra(CompraData);
    response.status(201).json({ serverResponse: result });
  }
  public async getCompras(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    let year = new Date();
    let gestion = year.getFullYear();
    params.concepto = `Saldo Inicial ${gestion}`;
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.del != null) {
      var gt = params.del;
      aux["$gte"] = gt;
    } else {
      aux["$gte"] = `${gestion}-01-01T04:00:00.000Z`;
    }
    if (params.al != null) {
      var lt = params.al;
      let date = new Date(lt);
      date.setDate(date.getDate() + 1);

      aux["$lte"] = date;
    } else {
      aux["$lte"] = `${gestion}-12-31T04:00:00.000Z`;
    }
    if (params.estadoCompra != null) {
      var estadoCompra = new RegExp(params.estadoCompra, "i");
      filter["estadoCompra"] = estadoCompra;
    }
    if (params.catProgra != null) {
      if (params.catProgra === "") {
        delete params.catProgra;
      } else {
        var catProgra = params.catProgra;
        filter["catProgra"] = catProgra;
      }
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
      Compra.readCompra(filter, skip, limit, order),
      Compra.total({}),
    ]);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage: (number = Math.ceil(totalDocs / limit)),
      skip,
    });
    return;
  }
  public async getCompra(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    let res = await Compra.readCompra(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async updateCompra(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Compra.updateCompra(id, params);
    response.status(200).json(result);
  }

  public async removeCompra(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    let id: string = request.params.id;
    let result = await Compra.deleteCompra(id);
    response.status(200).json({ serverResponse: "Se elimino la Compra" });
  }
  public async searchCompra(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var searchCompra = request.params.search;
    let res = await Compra.searchCompra(searchCompra);
    response.status(200).json({ serverResponse: res });
  }
  public async searchCombustible(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var searchArticulo = request.params.articulo;
    var searchCatProgra = request.params.catProgra;
    let res = await Compra.searchCombustible(searchArticulo, searchCatProgra);
    response.status(200).json({ serverResponse: res });
  }
  public async queryCompraCatPro(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var quieryIngreso = request.params.search;
    let res = await Compra.queryCompraCatPro(quieryIngreso);
    response.status(200).json({ serverResponse: res, total: res.length });
  }

  public async searchCompraAll(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var filter1: any = {};
    var filter2: any = {};
    var params: any = request.query;
    if (params.catProgra != null) {
      var catProgra = new RegExp(params.catProgra, "i");
      filter1["catProgra"] = catProgra;
    }
    if (params.estadoCompra != null) {
      var estadoCompra = new RegExp(params.estadoCompra, "i");
      filter1["estadoCompra"] = estadoCompra;
    }
    if (params.idProducto != null) {
      var expresion = new RegExp(params.idProducto);
      filter1["idProducto"] = expresion;
    }
    if (params.cantidadCompra != null) {
      var cantidadCompra = new RegExp(params.cantidadCompra, "i");
      filter1["cantidadCompra"] = cantidadCompra;
    }
    if (params.stockCompra != null) {
      var stockCompra = new RegExp(params.stockCompra, "i");
      filter1["stockCompra"] = stockCompra;
    }
    if (params.codigo != null) {
      var codigo = new RegExp(params.codigo);
      filter2["codigo"] = codigo;
    }
    if (params.nombre != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter2["nombre"] = nombre;
    }
    if (params.unidadDeMedida != null) {
      var unidadDeMedida = new RegExp(params.unidadDeMedida, "i");
      filter2["unidadDeMedida"] = unidadDeMedida;
    }
    if (params.cantidad != null) {
      var cantidad = new RegExp(params.cantidad, "i");
      filter2["cantidad"] = cantidad;
    }
    if (params.estado != null) {
      var expresion = new RegExp(params.estado);
      filter2["estado"] = expresion;
    }
    let res = await Compra.searchCompraAll(filter1, filter2);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async queryCompraSaldo(request: Request, response: Response) {
    var Compra: BussCompra = new BussCompra();
    var filter1: any = {};
    var filter2: any = {};
    var params: any = request.query;
    if (params.catProgra != null) {
      var expresion = new RegExp(params.catProgra);
      filter1["catProgra"] = expresion;
    }
    if (params.estadoCompra != null) {
      var expresion = new RegExp(params.estadoCompra);
      filter1["estadoCompra"] = expresion;
    }
    if (params.idProducto != null) {
      var expresion = new RegExp(params.idProducto);
      filter1["idProducto"] = expresion;
    }
    let res = await Compra.queryCompraSaldo(filter1, filter2);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async contAlmacenes(request: Request, response: Response) {
    var Proveedores: BussProveedores = new BussProveedores();
    var segPoa: BussSegPoa = new BussSegPoa();
    var Articulo: BussArticulo = new BussArticulo();
    var Medida: BussMedida = new BussMedida();
    var Ingreso: BussIngreso = new BussIngreso();
    var compra: BussCompra = new BussCompra();
    var Egreso: BussEgreso = new BussEgreso();
    var salida: BussSalida = new BussSalida();
    var filter: any = {};
    var params: any = request.query;
    var aux: any = {};
    if (params.del != null) {
      var del = params.del;
      aux["$gte"] = del;
    }
    if (params.al != null) {
      var al = params.al;
      aux["$lte"] = al;
    }
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    const [
      totalProveedores,
      totalSegPoa,
      totalArticulos,
      totalMedidas,
      totalIngreso,
      totalCompra,
      totalEgreso,
      totalSalida,
    ] = await Promise.all([
      Proveedores.total({}),
      segPoa.total({}),
      Articulo.total({}),
      Medida.total({}),
      Ingreso.totalCount(filter),
      compra.totalCount(filter),
      Egreso.totalCount(filter),
      salida.totalCount(filter),
    ]);
    response.status(200).json({
      totalProveedores,
      totalSegPoa,
      totalArticulos,
      totalMedidas,
      totalIngreso,
      totalCompra,
      totalEgreso,
      totalSalida,
    });
    return;
  }
  public async searchArticulosAll(request: Request, response: Response) {
    var Articulo: BussArticulo = new BussArticulo();
    var filter1: any = {};
    var filter2: any = {};
    var aux: any = {};
    var params: any = request.query;
    if (params.codigo != null) {
      var codigo = new RegExp(params.codigo, "i");
      filter1["codigo"] = codigo;
    }
    if (params.unidadDeMedida != null) {
      let unidadDeMedida = params.unidadDeMedida;
      if (unidadDeMedida != "null" && unidadDeMedida != "") {
        filter1["unidadDeMedida"] = unidadDeMedida;
      } else {
        delete filter1.unidadDeMedida;
      }
    }
    if (params.nombre != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter1["nombre"] = nombre;
    }
    if (params.cantidad != null) {
      var cantidad: number = parseInt(params.cantidad);
      if (Number.isNaN(cantidad)) {
        filter1["cantidad"];
      } else {
        filter1["cantidad"] = cantidad;
      }
    }
    if (params.idPartida != null) {
      let idPartida = params.idPartida;
      if (!ObjectId.isValid(idPartida)) {
        filter2["_id"] = "";
      } else {
        filter2["_id"] = idPartida;
      }
    }
    if (params.stock != null) {
      var stock: number = parseInt(params.stock);
      if (stock === 1) {
        aux["$lt"] = stock;
      } else if (stock === 0) {
        aux["$gt"] = stock;
      } else {
        aux[""];
      }
    }
    if (Object.entries(aux).length > 0) {
      filter1["cantidad"] = aux;
    }
    let res = await Articulo.searchArticuloAll(filter1, filter2);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async cierreGestion(request: Request, response: Response) {
    var ingreso: BussIngreso = new BussIngreso();
    var compra: BussCompra = new BussCompra();
    const params = request.body;
    var filter: any = { stockCompra: { $gt: 0 } };
    let resStokCompra: any = await compra.readCompra(filter);
    let year = new Date();
    let gestion = year.getFullYear();
    let date = `${gestion - 1}-12-31`;
    params.concepto = `Saldo Inicial ${gestion}`;
    params.fecha = year;
    params.numeroEntrada = 1;
    params.estado = "REGISTRADO";
    params.tipo = "SALDO_INICIAL";
    params.idPersona = "6253bf6900ae6f0014f7bc23"; //cambiar
    params.idUsuario = "6253bf6900ae6f0014f7bc23"; //cambiar
    params.idProveedor = "65c63b0580c97d003f229223"; //cambiar a proveedor gamb
    let result = await ingreso.addIngreso(params);
    console.log(params);
    for (let i = 0; i < resStokCompra.length; i++) {
      let data = resStokCompra[i];

      let saldoData: any = {};
      let compraData: any = {};
      saldoData["idEntrada"] = result._id;
      saldoData["idArticulo"] = data.idArticulo._id;
      saldoData["idProducto"] = data.idArticulo._id;
      saldoData["catProgra"] = data.catProgra;
      saldoData["cantidadCompra"] = data.stockCompra;
      saldoData["stockCompra"] = data.stockCompra;
      saldoData["ubicacion"] = data.ubicacion;
      saldoData["precio"] = data.precio;
      compraData.stockCompra = 0;
      compraData.estadoCompra = "AGOTADO";
      let resultCompra = await compra.addCompra(saldoData);
      let idCompra = resultCompra._id;
      await ingreso.addCompras(result._id, idCompra);
      await compra.updateCompra(data._id, compraData);
    }
    let paramsDate: any = {};
    paramsDate["createdAt"] = new Date(date);
    var filter: any = {
      createdAt: { $gt: `${gestion}-01-01` },
      estadoCompra: "AGOTADO",
    };
    let resCompra: any = await compra.readCompra(filter);
    compra.updateCompraAll(filter, paramsDate);
    response
      .status(200)
      .json({ serverResponse: result, total: resStokCompra.length });
  }
  //----------AUTORIZACION------------//
  public async createAutorizacion(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    var AutorizacionData = request.body;
    const resp: any = await Autorizacion.getNumAut();
    //console.log(resp);
    let year = new Date();
    let yearAct = year.getFullYear();
    if (isEmpty(resp)) {
      //console.log(AutorizacionData);
      AutorizacionData["numeroAutorizacion"] = 1;
      let result = await Autorizacion.addAutorization(AutorizacionData);
      response.status(201).json({ serverResponse: result });
      return;
    }
    let yearRes = resp.fecha.getFullYear();
    if (yearAct != yearRes) {
      //console.log(AutorizacionData);
      AutorizacionData["numeroAutorizacion"] = 1;
      let result = await Autorizacion.addAutorization(AutorizacionData);
      response.status(201).json({ serverResponse: result });
      return;
    }
    AutorizacionData["numeroAutorizacion"] = resp.numeroAutorizacion + 1;
    let result = await Autorizacion.addAutorization(AutorizacionData);
    console.log(AutorizacionData);
    response.status(201).json({ serverResponse: result });
  }
  public async getAutorizaciones(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    var filter: any = {};
    var search: string | any;
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.destino != null) {
      var expresion = new RegExp(params.destino, "i");
      filter["destino"] = expresion;
    }
    if (params.motivo != null) {
      var expresion = new RegExp(params.motivo, "i");
      filter["motivo"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.numeroAutorizacion != null) {
      let expresion = params.numeroAutorizacion;
      filter["numeroAutorizacion"] = expresion;
    }
    if (params.numeroVale != null) {
      let expresion = params.numeroVale;
      filter["numeroVale"] = expresion;
    }
    if (params.fecha != null) {
      var gt = params.fecha;
      aux["$gt"] = gt;
    }
    if (params.fecha != null) {
      var lt = params.fecha;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["createdAt"] = aux;
    }
    let respost: Array<IAutorizacion> = await Autorizacion.readAutorization();
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

    let res: Array<IAutorizacion> = await Autorizacion.readAutorization(
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
  public async listAutorizacion(request: Request, response: Response) {
    var convenio: BussAutorization = new BussAutorization();
    var searchAutorizacion = request.params.search;
    let res = await convenio.searchAutorization();
    response.status(200).json({ serverResponse: res });
  }
  public async getAutorizacion(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    let repres = await Autorizacion.readAutorization(request.params.id);
    response.status(200).json(repres);
  }
  public async getAutorizacionCod(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    let codigo = request.params.codigo;
    let repres = await Autorizacion.readAutorization(codigo);
    response.status(200).json(repres);
  }
  public async updateAutorizacion(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Autorizacion.updateAutorization(id, params);
    response.status(200).json(result);
  }
  public async removeAutorizacion(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    let id: string = request.params.id;
    let result = await Autorizacion.deleteAutorization(id);
    response.status(200).json({ serverResponse: "Se elimino el Registro" });
  }
  //----------VEHICULOS------------//
  public async createVehiculo(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    var VehiculoData = request.body;
    let result = await Vehiculo.addVehiculo(VehiculoData);
    response.status(201).json({ serverResponse: result });
  }
  public async getVehiculos(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
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
    let respost: Array<IVehiculo> = await Vehiculo.readVehiculo();
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
    let res: Array<IVehiculo> = await Vehiculo.readVehiculo(
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
  public async getVehiculo(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    let repres = await Vehiculo.readVehiculo(request.params.id);
    response.status(200).json(repres);
  }
  public async updateVehiculo(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Vehiculo.updateVehiculo(id, params);
    response.status(200).json(result);
  }
  public async removeVehiculo(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    let id: string = request.params.id;
    let result = await Vehiculo.deleteVehiculo(id);
    response.status(200).json({ serverResponse: "Se elimino Vehiculo" });
  }
  public async searchVehiculo(request: Request, response: Response) {
    var Vehiculo: BussVehiculo = new BussVehiculo();
    var searchVehiculo = request.params.search;
    let res = await Vehiculo.searchVehiculo(searchVehiculo);
    response.status(200).json({ serverResponse: res });
  }
  //------------VALES---------//
  //listar
  public async getVales(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var aux1: any = {};
    var order: any = {};
    var select = "";
    if (params.catProgra != null) {
      let expresion = params.catProgra;
      filter["catProgra"] = expresion;
    }
    if (params.conductor != null) {
      let expresion = params.conductor;
      filter["conductor"] = expresion;
    }
    if (params.vehiculo != null) {
      let expresion = params.vehiculo;
      filter["vehiculo"] = expresion;
    }
    if (params.estado != null) {
      let expresion = params.estado;
      filter["estado"] = expresion;
    }
    if (params.numeroVale != null) {
      let expresion = params.numeroVale;
      filter["numeroVale"] = expresion;
    }
    if (params.numAntiguo != null) {
      let expresion = params.numAntiguo;
      filter["numAntiguo"] = expresion;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.del != null) {
      var gt = params.del;
      let fechaDel = new Date(gt);
      aux["$gte"] = fechaDel;
    }
    if (params.al != null) {
      var lt = params.al;
      let fechaAl = lt + "T23:59:59.000Z";
      
      aux["$lte"] = fechaAl;
    }
    if (params.productos === true) {
      var size = params.productos;
      filter["productos"] = { $exists: true, $not: { $size: 0 } };
    }
    if (Object.entries(aux).length > 0) {
      filter["fecha"] = aux;
    }
    let respost: Array<IVale> = await Vale.readVale();
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
      order = { _id: -1, numeroVale:-1, fecha: -1 };
    }
    let res: Array<IVale> = await Vale.readVale(filter, skip, limit, order);
    console.log('SOLO FILTER',filter);

    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
    });
    return;
  }
  public async getValesReport(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    var filter: any = {};
    var filter2: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var aux1: any = {};
    var order: any = {};
    var select = "";
    if (params.catProgra != null) {
      let expresion = params.catProgra;
      filter["catProgra"] = expresion;
    }
    if (params.estado != null) {
      let expresion = params.estado;
      filter["estado"] = expresion;
    }
    if (params.numeroVale != null) {
      let expresion = params.numeroVale;
      filter["numeroVale"] = expresion;
    }
    if (params.numAntiguo != null) {
      let expresion = params.numAntiguo;
      filter["numAntiguo"] = expresion;
    }
    if (params.numAntiguo != null) {
      let expresion = params.numAntiguo;
      filter["numAntiguo"] = expresion;
    }
    if (params.conductor != null) {
      let expresion = params.conductor;
      filter["conductor"] = expresion;
       filter2["conductor"] = expresion;
    }
    if (params.vehiculo != null) {
      let expresion = params.vehiculo;
      filter["vehiculo"] = expresion;
     
    }
    if (params.saldoDevolucion != null) {
      let expresion = params.saldoDevolucion;
      filter["saldoDevolucion"] = { $ne: +expresion };
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.del != null) {
      var gt = params.del;
      let fechaDel = new Date(gt);
      aux["$gte"] = fechaDel;
    }
    if (params.al != null) {
      var lt = params.al;
      let fechaAl = lt + "T23:59:59.000Z";

      aux["$lte"] = fechaAl;
    }
    if (params.productos === true) {
      var size = params.productos;
      filter["productos"] = { $exists: true, $not: { $size: 0 } };
    }
    if (Object.entries(aux).length > 0) {
      filter["fecha"] = aux;
    }
    filter["productos"] = {$exists: true, $not: { $ne: [] } };
    filter["precio"] = { $ne: null };
    //console.log(filter,filter2);
    
    let respost: Array<IVale> = await Vale.getVales(filter,filter2);
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
      order = { _id: -1, numeroVale:-1, fecha: -1 };
    }
    let resp: Array<IVale>=[]
    let result: Array<IVale>=[]
    let res: Array<IVale> = await Vale.getVales(filter, order);
    // if(filter2 && typeof filter2 === "object" && Object.keys(filter2).length === 0){
    //   result = res;
    // }else{
    //   resp = await Vale.getValesAut(filter, filter2);
    //   result = res.concat(resp);
    // }
    console.log(filter2, filter);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
    });
    return;
  }
  //crear
  public async createVale(request: Request, response: Response) {
    var vale: BussVale = new BussVale();
    var Autorizacion: BussAutorization = new BussAutorization();
    var compra: BussCompra = new BussCompra();
    var Ingreso: BussIngreso = new BussIngreso();
    var Articulo: BussArticulo = new BussArticulo();
    var Egreso: BussEgreso = new BussEgreso();
    var salida: BussSalida = new BussSalida();
    var valeData = request.body;
    let numero: Number = 1;
    let paramsAut: any = {};
    let paramsEgreso: any = {};
    let paramsSalida: any = {};
    let paramsCompra: any = {};
    let paramsArticulo: any = {};
    let paramsIngreso: any = {};
    let AutorizacionData: any = {};
    let year = new Date();
    let yearAct = year.getFullYear();
    let nombreConductor =  'Conductor';
    
    if(valeData.autorizacion){
      AutorizacionData = await Autorizacion.readAutorization(valeData.autorizacion);
      nombreConductor = `${AutorizacionData.conductor.username} ${AutorizacionData.conductor.surnames}`;
    }
    
    if(AutorizacionData.numeroVale!=null){
      response.status(300).json({ serverResponse: `Este vale ya fue generado para la autorización Nº ${AutorizacionData.numeroVale} ` });
      return;
    }
    let conductor = valeData.conductor?? AutorizacionData.conductor._id ;
    let vehiculo =  valeData.vehiculo?? AutorizacionData.vehiculo._id;
    let filter1: any = {conductor: conductor, estado:'REGISTRADO', fecha: { $gte: `${yearAct}-01-01T00:00:00.000Z`, $lte: `${yearAct}-12-31T23:59:59.000Z` }, productos: { $exists: true, $not: { $ne: [] } }, precio: { $ne: null } };
    // let filter2: any = {conductor:AutorizacionData.conductor._id};
    const respVale: any = await vale.getVales(filter1);

    
    if(respVale.length>6){
      response.status(300).json({ serverResponse: `${nombreConductor} debe presentar las facturas pendientes al responsable de fondo rotatorio` });
      return;
    }
    const respEgreso: any = await Egreso.getNumEgreso();
    if (valeData.idCompra == "") {
      delete valeData.idCompra;
    }
    const resp: any = await vale.getNumVale();
    
    if (resp) {
      numero = resp.numeroVale + numero;

      let yearRes = resp.fecha.getFullYear();
      if (yearAct != yearRes) {
        numero = 1;
      }
    }
     if(valeData.precio){
      if(valeData.idProducto==='642c3e7b3b1ac20013da2571'){
        valeData.cantidad=valeData.precio / 3.74
      }
      if(valeData.idProducto==='6439b82156cc6b00132c9ab2'){
        valeData.cantidad=valeData.precio / 3.72
      }
    }
    // console.log('valeData',valeData);
    valeData["numeroVale"] = numero;
    valeData["conductor"] = valeData.conductor?? AutorizacionData.conductor._id ;
    valeData["vehiculo"] =  valeData.vehiculo?? AutorizacionData.vehiculo._id;
    let result = await vale.addVale(valeData);
     console.log('result',result);
    
    paramsAut.numeroVale = result.numeroVale;
    await Autorizacion.updateAutorization(valeData.autorizacion, paramsAut);
    if (!valeData.idCompra) {
      response.status(201).json({ serverResponse: result });
      return;
    }
    let listCompra = await compra.readCompra(valeData.idCompra);
    let entrada: any = listCompra.idEntrada;
    let Simplearticulo: any = listCompra.idArticulo;
    let solicitante: String = `${
      AutorizacionData.unidadSolicitante.user.username
    } ${AutorizacionData.unidadSolicitante.user.surnames}`;
    let entregadoA: String = `${AutorizacionData.conductor.username}${" "}${
      AutorizacionData.conductor.surnames
    } `;
    paramsEgreso.entregado = entregadoA;
    paramsEgreso.cargo = AutorizacionData.conductor.post;
    paramsEgreso.numeroSalida = respEgreso.numeroSalida + 1;
    paramsEgreso.idProveedor = entrada.idProveedor._id;
    paramsEgreso.idPersona = valeData.encargadoControl;
    paramsEgreso.idIngreso = entrada._id;
    paramsEgreso.glosaSalida = `Salida de ${Simplearticulo.nombre} solicitado por ${solicitante} para ${AutorizacionData.motivo}`;
    let resultEgreso = await Egreso.addEgreso(paramsEgreso);
    paramsSalida.cantidadSalida = valeData.cantidad;
    paramsSalida.catProgra = valeData.catProgra;
    paramsSalida.idCompra = valeData.idCompra;
    paramsSalida.idEgreso = resultEgreso._id;
    let resultSalida = await salida.addSalida(paramsSalida);
    let idSalida = resultSalida._id;
    var resultAdd = await Egreso.addSalidas(resultEgreso._id, idSalida);
    var compraAdd = await compra.addSalidas(valeData.idCompra, idSalida);
    let stock: Number = Simplearticulo.cantidad - valeData.cantidad;
    let stockCompra: Number = listCompra.stockCompra - valeData.cantidad;
    paramsCompra.stockCompra = stockCompra;
    paramsArticulo.cantidad = stock;
    if (stockCompra === 0) {
      paramsCompra.estadoCompra = "AGOTADO";
    } else {
      paramsCompra.estadoCompra = "EXISTE";
    }
    let result1 = await Articulo.updateArticulo(
      Simplearticulo._id,
      paramsArticulo
    );
    let resultCompra = await compra.updateCompra(
      valeData.idCompra,
      paramsCompra
    );
    paramsIngreso.estado = "SALIDA";
    var resul = await Ingreso.updateIngreso(entrada._id, paramsIngreso);
    response.status(201).json({ serverResponse: result });
  }
  public async getVale(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    let valeData = await Vale.readVale(request.params.id);
    response.status(200).json(valeData);
  }
  public async getValesAll(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    let valeData = await Vale.readVale();
    for (let i = 0; i < valeData.length; i++) {
      let data: any = valeData[i];
      let datares: any = {};
      datares.fecha = data.createdAt;
      var result = await Vale.updateVale(data._id, datares);
    }
    response.status(200).json(valeData.length);
  }
  public async updateVale(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    let id: string = request.params.id;
    var params = request.body;
    let valeData = await Vale.readVale(id);
    if (params.precio) {
      if (params.idProducto === "642c3e7b3b1ac20013da2571") {
        params.cantidad = params.precio / 3.74;
      }
      if (params.idProducto === "6439b82156cc6b00132c9ab2") {
        params.cantidad = params.precio / 3.72;
      }
    }
    console.log("params", params);
    
    var result = await Vale.updateVale(id, params);
    response.status(200).json(result);
  }
  public async setVales(request: Request, response: Response) {
    var compra: BussCompra = new BussCompra();
    var Vale: BussVale = new BussVale();
    var Ingreso: BussIngreso = new BussIngreso();
    var Articulo: BussArticulo = new BussArticulo();
    var Egreso: BussEgreso = new BussEgreso();
    var salida: BussSalida = new BussSalida();
    var resp = request.body;
    const compraData: any = {};
    const ingresoData: any = {};
    const salidaData: any = {};
    const egresoData: any = {};

    if (resp.length < 1) {
      response
        .status(201)
        .json({ serverResponse: "Debe existir al menos un vale" });
      return;
    }
    const resNum: any = await Ingreso.getNumIngresoOne();
    const respEgreso: any = await Egreso.getNumEgreso();

    let dataFecha = resp[resp.length - 1];
    let fecha = dataFecha.createdAt;

    ingresoData.numeroEntrada = resNum.numeroEntrada + 1;
    ingresoData.idPersona = "6253bf6900ae6f0014f7bc23";
    ingresoData.idProveedor = "643473b2adb0190013ff255b";
    ingresoData.concepto =
      "Ingreso de COMBUSTIBLE para el viaje programado a diferentes comunidades";
    ingresoData.estado = "EGRESADO";
    ingresoData.fecha = fecha;
    let resultIngreso = await Ingreso.addIngreso(ingresoData);

    egresoData.numeroSalida = respEgreso.numeroSalida + 1;
    egresoData.estadoEgreso = "DIRECTO";
    egresoData.glosaSalida =
      "Salida de COMBUSTIBLE para el viaje programado a diferentes comunidades";
    egresoData.entregado = "Conductores de vehículos";
    egresoData.cargo = "Chofer";
    egresoData.idPersona = "6253bf6900ae6f0014f7bc23";
    egresoData.idProveedor = "643473b2adb0190013ff255b";
    egresoData.idIngreso = resultIngreso._id;
    egresoData.fecha = fecha;
    //console.log("resul ingreso",resultIngreso);
    let resultEgreso = await Egreso.addEgreso(egresoData);

    const egresoAdd = await Ingreso.addEgresos(resultIngreso, resultEgreso._id);
    //console.log('resultEgreso',resultEgreso);
    for (let i = 0; i < resp.length; i++) {
      let data: any = resp[i];
      compraData.cantidadCompra = data.cantidad;
      compraData.estadoCompra = "AGOTADO";
      compraData.idEntrada = resultIngreso._id;
      compraData.idArticulo = data.idProducto._id;
      compraData.idProducto = data.idProducto._id;
      compraData.catProgra = data.catProgra;
      if (data.precio != null) {
        compraData.precio = data.cantidadAdquirida / data.cantidad;
      }
      let resultCompra = await compra.addCompra(compraData);
      const resultAdd = await Ingreso.addCompras(
        resultIngreso._id,
        resultCompra._id
      );

      salidaData.cantidadSalida = data.cantidad;
      salidaData.catProgra = data.catProgra;
      salidaData.idCompra = resultCompra._id;
      salidaData.idEgreso = resultEgreso._id;
      let resultSalida = await salida.addSalida(salidaData);
      const compraAdd = await compra.addSalidas(
        resultCompra._id,
        resultSalida._id
      );
      const resultAddEgreso = await Egreso.addSalidas(
        resultEgreso._id,
        resultSalida._id
      );

      const updateVale = await Vale.updateVale(data._id, {
        estado: "FINALIZADO",
        idCompra: resultCompra._id,
      });
    }

    response.status(200).json({ resp });
  }
  public async deleteVale(request: Request, response: Response) {
    var vale: BussVale = new BussVale();
    var Autorizacion: BussAutorization = new BussAutorization();
    let id: string = request.params.id;
    const valeData: any = await vale.readVale(id);
    if (valeData.idCompra) {
      response
        .status(300)
        .json({
          serverResponse:
            "Este registro no se puede eliminar!!! Motivo de que ya tiene Ingreso y Salida",
        });
      return;
    }
    if (valeData.estado === "PENDIENTE") {
      response
        .status(300)
        .json({
          serverResponse:
            "Para poder eliminar el registro. Debe cambiar el estado de PENDIENTE a REGISTRADO",
        });
      return;
    }
    if (valeData.autorizacion) {
      if (valeData.numeroVale === valeData.autorizacion.numeroVale) {
        let params: any = {};
        params.numeroVale = null;
        await Autorizacion.updateAutorization(
          valeData.autorizacion._id,
          params
        );
      }
    }
    let result = await vale.deleteVale(id);
    response.status(200).json({ serverResponse: "Se elimino el Registro" });
  }
  public async addFactura(request: Request, response: Response) {
    var Vale: BussVale = new BussVale();
    const factura: BussFactura = new BussFactura();
    let id: string = request.params.id;
    var params = request.body;
    let valeData: any = await Vale.readVale(id);
    let idProducto:string = valeData.idProducto._id;
    if (idProducto == "642c3e7b3b1ac20013da2571") {
      params.cantidadFactura = params.montoFactura / 3.74;
    }
    if (idProducto == "6439b82156cc6b00132c9ab2") {
      params.cantidadFactura = params.montoFactura / 3.72;
    }
    params.idVale = id;
    let filter = { idVale: id, numeroFactura: params.numeroFactura };
    const getFactura = await factura.readFactura(filter);
    if (getFactura.length > 0) {
      response.status(300).json({ serverResponse: "Este numero de factura ya fue registrado" });
      return
    }
    const resultFactura = await factura.addFactura(params); 
    if(valeData.idFacturas.length === 0){    
      params.cantidad = resultFactura.cantidadFactura;
    }else{
      params.cantidad = valeData.cantidad + resultFactura.cantidadFactura;
    }
    if(valeData.estado === "REGISTRADO"){
      params.estado = "PENDIENTE";
    }
    params.cantidadAdquirida = valeData.cantidadAdquirida + resultFactura.montoFactura;
    params.saldoDevolucion = valeData.precio-params.cantidadAdquirida;
    let datos: any = { idFacturas: resultFactura._id};
    await Vale.updatePushFactura(id, datos);
    const result = await Vale.updateVale(id, params);
    response.status(200).json(valeData);
  }
  public async getFacturas(request: Request, response: Response) {
    const factura: BussFactura = new BussFactura();
    var filter: any = {};
    var params: any = request.query;
    let year = new Date();
    let yearAct = params.gestion ?? year.getFullYear();
    if (yearAct != null) {
      filter["fechaFactura"] = {$gte:`${yearAct}-01-01T00:00:00.000Z`,$lte:(`${yearAct}-12-31T23:59:59.000Z`)};
    }
    const pdfDoc = await factura.gerReportFactura(filter);
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.info.Title = "Factura";
    pdfDoc.pipe(response);
    pdfDoc.end();
    return;
  }
  public async getReportsIngresosTotalCompras(request: Request, response: Response) {
    const ingreso: BussIngreso = new BussIngreso();
    var filter: any = {};
    var params: any = request.query;
    let year = new Date();
    let yearAct = params.gestion ?? year.getFullYear();
    if (yearAct != null) {
      filter["fecha"] = {$gte:`${yearAct}-01-01T00:00:00.000Z`,$lte:(`${yearAct}-12-31T23:59:59.000Z`)};
    }
    console.log(filter);
    
    const pdfDoc = await ingreso.getReportsIngresosTotalCompras(filter);
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.info.Title = "Ingresos Total Compras";
    pdfDoc.pipe(response);
    pdfDoc.end();
    return;
  }
  public async getReportsLubricantes(request: Request, response: Response) {
    var vale: BussVale = new BussVale();
    var filter: any = {};
    var params: any = request.query;
    let year = new Date();
    let yearAct = params.gestion ?? year.getFullYear();
    if (yearAct != null) {
      filter["fecha"] = {$gte:`${yearAct}-01-01T00:00:00.000Z`,$lte:(`${yearAct}-12-31T23:59:59.000Z`)};
    }
    filter["productos"] = { $exists: true, $not: { $size: 0 } };
    console.log(filter);
    
    const pdfDoc = await vale.getReportsLubricantes(filter);
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.info.Title = "Ingresos Total Compras";
    pdfDoc.pipe(response);
    pdfDoc.end();
    return;
  }

  public async printVale(request: Request, response: Response) {
    var vale: BussVale = new BussVale();
    let id: string = request.params.id;
    let user: string = request.body.user;
    const pdfDoc = await vale.printVale(id, user);
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.info.Title = "Información del Vale";
    pdfDoc.pipe(response);
    pdfDoc.end();
    return;
  }

  public async getPedidos(request: Request, response: Response) {
    var pedidos: BussPedidos = new BussPedidos();
    var filter: any = {};
    var filter2: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.glosaSalida != null) {
      var glosaSalida = new RegExp(params.glosaSalida, "i");
      filter["glosaSalida"] = glosaSalida;
    }
    if (params.numeroSalida != null) {
      var numeroSalida: number = parseInt(params.numeroSalida);
      if (Number.isNaN(numeroSalida)) {
        filter["numeroSalida"];
      } else {
        filter["numeroSalida"] = numeroSalida;
      }
    }
    if (params.entregado != null) {
      var entregado = new RegExp(params.entregado, "i");
      filter["entregado"] = entregado;
    }
    if (params.cargo != null) {
      var cargo = new RegExp(params.cargo, "i");
      filter["cargo"] = cargo;
    }
    if (params.del != null) {
      var gt = params.del;
      aux["$gt"] = gt;
    }
    if (params.al != null) {
      var lt = params.al;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["fecha"] = aux;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    let respost: any = await pedidos.totales(filter);
    var totalDocs = respost.length;
    var totalpage = Math.ceil(totalDocs / limit);
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
    let res: Array<IPedidos> = await pedidos.readPedidos(
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
  public async createPedido(request: Request, response: Response) {
    const pedidos: BussPedidos = new BussPedidos();
    const Egreso: BussEgreso = new BussEgreso();
    const compra: BussCompra = new BussCompra();
    const salida: BussSalida = new BussSalida();
    const ingreso: BussIngreso = new BussIngreso();
    const articulo: BussArticulo = new BussArticulo();
    const pedidoData = request.body;
    log(pedidoData);
    let result: any;
    const resp: any = await pedidos.getNumPedido();
    if (isEmpty(resp)) {
      pedidoData["numeroPedido"] = 1;
      result = await pedidos.addPedido(pedidoData);
    } else {
      let num = resp.numeroPedido + 1;
      pedidoData["numeroPedido"] = num;
      // pedidoData["glosaSalida"] = EgresoData.concepto;
      result = await pedidos.addPedido(pedidoData);
    }
   /*  for (let i = 0; i < EgresoData.articulos.length; i++) {
      let data = EgresoData.articulos[i];
      let listCompra = await compra.readCompra(data.idCompra);
      let entrada: any = listCompra.idEntrada;
      let Simplearticulo: any = listCompra.idArticulo;
      EgresoData.cantidadSalida = data.cantidadSalida;
      EgresoData.idCompra = data.idCompra;
      EgresoData.catProgra = data.catProgra;
      EgresoData.idEgreso = result._id;
      let resultSalida = await salida.addSalida(EgresoData);
      let idSalida = resultSalida._id;
      var resultAdd = await Egreso.addSalidas(result._id, idSalida);
      var compraAdd = await compra.addSalidas(data.idCompra, idSalida);
      let stock: Number = Simplearticulo.cantidad - EgresoData.cantidadSalida;
      let stockCompra: Number =
        listCompra.stockCompra - EgresoData.cantidadSalida;
      EgresoData.stockCompra = stockCompra;
      EgresoData.cantidad = stock;
      if (stockCompra === 0) {
        EgresoData.estadoCompra = "AGOTADO";
      } else {
        EgresoData.estadoCompra = "EXISTE";
      }
      let result1 = await articulo.updateArticulo(
        Simplearticulo._id,
        EgresoData
      );
      let resultCompra = await compra.updateCompra(data.idCompra, EgresoData);
      const ENTRADA: ISimpleIngreso = {
        estado: "SALIDA",
      };
      var resul = await ingreso.updateIngreso(entrada._id, ENTRADA);
    } */
    response.status(201).json({ serverResponse: result });
  }
}
export default RoutesController;
