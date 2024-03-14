/* import e, { Request, Response } from "express";
import isEmpty from "is-empty";
import { IAutorizacion } from "../models/autorizacion";
import BussAutorization from "../businessController/autotizacion";

import { IVehiculo } from "../models/vehiculo";
import BussVehiculo from "../businessController/vehiculo";
const ObjectId = require("mongoose").Types.ObjectId;
class RoutesController {
  
  //----------AUTORIZACION------------//
  public async createAutorizacion(request: Request, response: Response) {
    var Autorizacion: BussAutorization = new BussAutorization();
    var AutorizacionData = request.body;
    const resp: any = await Autorizacion.getNumAut();
    //console.log(resp);
    let year = new Date();
    let yearAct = year.getFullYear()
    if (isEmpty(resp)) {
      //console.log(AutorizacionData);
      AutorizacionData["numeroAutorizacion"] = 1;
      let result = await Autorizacion.addAutorization(AutorizacionData);
      response.status(201).json({ serverResponse: result});
      return;
    }
    let yearRes = resp.fecha.getFullYear()
    if (yearAct!=yearRes) {
      //console.log(AutorizacionData);
      AutorizacionData["numeroAutorizacion"] = 1;
      let result = await Autorizacion.addAutorization(AutorizacionData);
      response.status(201).json({ serverResponse: result});
      return;
    }
    AutorizacionData["numeroAutorizacion"] = resp.numeroAutorizacion +1;
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
  public async searchAutorizacion(request: Request, response: Response) {
    var convenio: BussAutorization = new BussAutorization();
    var searchAutorizacion = request.params.search;
    let res = await convenio.searchAutorization(searchAutorizacion);
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
 
}
export default RoutesController;
 */