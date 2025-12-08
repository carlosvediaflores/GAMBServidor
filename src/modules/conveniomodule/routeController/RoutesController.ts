import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";

import { IEstmonto } from "./../models/estadomonto";
import { ITransferencia } from "./../models/transferencia";
import { IRepresentante } from "./../models/Representante";
import { IEntidad } from "../models/Entidad";
import BussEntidad from "../businesController/Entidad";
import BussRepres from "../businesController/Representante";
import BussConvenio from "../businesController/convenio";
import BussTransf from "../businesController/tranferencia";
import BussEstadoMonto from "../businesController/estadomonto";
import { IConvenio } from "../models/convenio";
import { IFilescv } from "../models/files";
import BussFiles from "../businesController/files";
import BussDesem from "../businesController/tranferencia";
import BussEntity from "../businesController/entity";
import { IEntity } from "../models/entities";
import { IFinaciadoras } from "../models/finaciadoras";
import BussFinanc from "../businesController/financiadoras";
import BussPartida from "../businesController/partidasg";
import { IPartidas } from "../models/partidasg";
import BussRubro from "../businesController/rubros";
import { IRubros } from "../models/rubros";
import { log } from "console";
class RoutesController {
  //*--------------Entidad------------------- *//
  public async createEntidad(request: Request, response: Response) {
    var entidad: BussEntidad = new BussEntidad();

    var entidadData = request.body;
    let result = await entidad.addEntidad(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getEntidad(request: Request, response: Response) {
    var entidad: BussEntidad = new BussEntidad();
    const result: Array<IEntidad> = await entidad.readEntidad();
    response.status(200).json(result);
  }
  public async getEnti(request: Request, response: Response) {
    var entidad: BussEntidad = new BussEntidad();
    let repres = await entidad.readEntidad(request.params.id);
    response.status(200).json(repres);
  }
  public async updateEntidad(request: Request, response: Response) {
    var entidad: BussEntidad = new BussEntidad();
    let id: string = request.params.id;
    var params = request.body;
    var result = await entidad.updateEntidad(id, params);
    response.status(200).json(result);
  }
  public async removeEntidad(request: Request, response: Response) {
    var entidad: BussEntidad = new BussEntidad();
    let id: string = request.params.id;
    let result = await entidad.deleteEntidad(id);
    response.status(200).json({ serverResponse: "Se elimino la entidad" });
  }
  public async addRepres(request: Request, response: Response) {
    let identi: string = request.params.id;
    //let idSub = request.body.idSub;
    if (identi == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var entity: BussEntity = new BussEntity();
    //var userResult: IUser = await orgToUpdate.save();
    let repres: BussRepres = new BussRepres();
    var represData: any = request.body;
    represData["identi"] = identi;
    console.log(represData);
    var result1 = await repres.addRepres(represData);
    let idSegui = result1._id;
    var result = await entity.addRepres(identi, idSegui);
    //console.log(result + "esto es el resultado");
    if (result1 == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar..." });
      return;
    }
    response.status(200).json({ serverResponse: result1 });
  }
  //*--------------Reprentantes------------------- *//
  public async createRepres(request: Request, response: Response) {
    var repres: BussRepres = new BussRepres();
    var entidadData = request.body;
    let result = await repres.addRepres(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getRepres(request: Request, response: Response) {
    var repres: BussRepres = new BussRepres();
    const result: Array<IRepresentante> = await repres.readRepres();
    response.status(200).json(result);
  }
  public async getReprese(request: Request, response: Response) {
    var repre: BussRepres = new BussRepres();
    let repres = await repre.readRepres(request.params.id);
    response.status(200).json(repres);
  }
  public async updateRepres(request: Request, response: Response) {
    var repres: BussRepres = new BussRepres();
    let id: string = request.params.id;
    var params = request.body;
    var result = await repres.updateRepres(id, params);
    response.status(200).json(result);
  }
  public async removeRepres(request: Request, response: Response) {
    var repres: BussRepres = new BussRepres();
    let id: string = request.params.id;
    let result = await repres.deleteRepres(id);
    response
      .status(200)
      .json({ serverResponse: "Se elimino el representante" });
  }
  //*--------------Convenios------------------- *//
  public async createConvenio(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    var entidadData = request.body;
    console.log(entidadData);
    let result = await convenio.addConvenio(entidadData);
    response.status(201).json({ serverResponse: result });
  }
  public async getConvenios(request: Request, response: Response) {
    var segui: BussConvenio = new BussConvenio();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    var select = "";
    if (params.nombre != null) {
      var expresion = new RegExp(params.nombre);
      filter["nombre"] = expresion;
    }
    if (params.codigo != null) {
      var expresion = new RegExp(params.codigo);
      filter["codigo"] = expresion;
    }
    if (params.entidades != null) {
      var expresion = new RegExp(params.entidades);
      filter["entidades"] = expresion;
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
      filter["firma"] = aux;
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
      segui.readConvenio(filter, skip, limit, order),
      segui.total({}),
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
  public async searchCV(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    var searchString = request.params.search;
    let res = await convenio.search(searchString);
    response.status(200).json({ serverResponse: res });
  }
  public async getConvenio(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    const result: Array<IConvenio> = await convenio.readConvenio();
    response.status(200).json(result);
  }
  public async addfinanciadoras(request: Request, response: Response) {
    let idconv: string = request.params.id;
    //let idSub = request.body.idSub;
    if (idconv == null) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para crear subdir" });
      return;
    }
    var conve: BussConvenio = new BussConvenio();
    //var userResult: IUser = await orgToUpdate.save();
    let financ: BussFinanc = new BussFinanc();
    var represData: any = request.body;
    var monto = represData.monto;
    //var montoInt= monto.replace(/\,/g, '');
    represData["idcv"] = idconv;
    //represData["monto"] = montoInt;
    var result1 = await financ.addFinanc(represData);
    let idFinanc = result1._id;
    var result = await conve.addfinanc(idconv, idFinanc);
    //console.log(result + "esto es el resultado");
    if (result1 == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar..." });
      return;
    }
    response.status(200).json({ serverResponse: result1 });
  }
  public async addEntidad(request: Request, response: Response) {
    let idConve: string = request.params.id;
    let idEnti: string = request.body.entidad;
    if (idConve == null && idEnti == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del rol",
      });
      return;
    }
    var convenio: BussConvenio = new BussConvenio();
    var result = await convenio.addEntidad(idConve, idEnti);
    if (result == null) {
      response.status(300).json({ serverResponse: "No se pudo guardar" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }
  public async getConveni(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    let repres = await convenio.readConvenio(request.params.id);
    response.status(200).json(repres);
  }
  public async updateConvenio(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    let id: string = request.params.id;
    var params = request.body;
    var enti: any = params.entidades;
    var total = 0;
    enti.forEach(function (ent: any) {
      total = parseInt(total + ent.monto);
    });
    params["montototal"] = total;
    var result = await convenio.updateConvenio(id, params);
    response.status(200).json(result);
  }
  public async editarEstado(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    let id: string = request.params.id;
    var params = request.body;
    var result = await convenio.updateConvenio(id, params);
    response.status(200).json(result);
  }
  public async removeConvenio(request: Request, response: Response) {
    var convenio: BussConvenio = new BussConvenio();
    let id: string = request.params.id;
    let result = await convenio.deleteConvenio(id);
    response.status(200).json({ serverResponse: "Se elimino el Convenio" });
  }
  // public async uploadConvenio(request: Request, response: Response) {
  //   var id: string = request.params.id;
  //   if (!id) {
  //     response
  //       .status(300)
  //       .json({ serverResponse: "El id es necesario para subir un archivo" });
  //     return;
  //   }
  //   var convenio: BussConvenio = new BussConvenio();
  //   var convenioToUpdate: IConvenio = await convenio.readConvenio(id);
  //   log("convenioToUpdate", convenioToUpdate);
  //   if (!convenioToUpdate) {
  //     response.status(300).json({ serverResponse: "convenio no existe!" });
  //     return;
  //   }
  //   if (isEmpty(request.files)) {
  //     response
  //       .status(300)
  //       .json({ serverResponse: "No existe un archivo adjunto" });
  //     return;
  //   }
  //   var dir = `${__dirname}/../../../../uploads/convenios/documentos`;
  //   var absolutepath = path.resolve(dir);
  //   var files: any = request.files;
  //   var key: Array<string> = Object.keys(files);
  //   var copyDirectory = (totalpath: string, file: any) => {
  //     return new Promise((resolve, reject) => {
  //       file.mv(totalpath, (err: any, success: any) => {
  //         if (err) {
  //           resolve(false);
  //           return;
  //         }
  //         resolve(true);
  //         return;
  //       });
  //     });
  //   };
  //   let fil: BussFiles = new BussFiles();
  //   var filData: any = request.body;
  //   for (var i = 0; i < key.length; i++) {
  //     var file: any = files[key[i]];
  //     var nombreCortado = file.name.split(".");
  //     var extensionArchivo = nombreCortado[nombreCortado.length - 1];
  //     var filehash: string = sha1(new Date().toString()).substr(0, 5);
  //     var newname: string = `${"GAMB"}_${filehash}_${filData.typefile
  //       }.${extensionArchivo}`;
  //     var totalpath = `${absolutepath}/${newname}`;
  //     await copyDirectory(totalpath, file);
  //     var hojaResult: IConvenio = await convenioToUpdate.save();
  //     filData["idcv"] = id;
  //     filData["uriconvenio"] = "getfileconvenio/" + newname;
  //     filData["patconvenio"] = totalpath;
  //     filData["namefile"] = newname;
  //     var result1 = await fil.addFilecv(filData);
  //     let idFile = result1._id;
  //     var result = await convenio.addFiles(id, idFile);
  //     if (result == null) {
  //       response.status(300).json({ serverResponse: "no se pudo guardar..." });
  //       return;
  //     }
  //     response.status(200).json({ serverResponse: "se subió con éxito" });
  //   }
  // }
  public async uploadConvenio(request: Request, response: Response) {
  var id: string = request.params.id;

  if (!id) {
    response
      .status(300)
      .json({ serverResponse: "El id es necesario para subir un archivo" });
    return;
  }

  var convenio: BussConvenio = new BussConvenio();
  var convenioToUpdate: IConvenio = await convenio.readConvenio(id);

  if (!convenioToUpdate) {
    response.status(300).json({ serverResponse: "convenio no existe!" });
    return;
  }

  if (isEmpty(request.files)) {
    response
      .status(300)
      .json({ serverResponse: "No existe un archivo adjunto" });
    return;
  }

  var dir = `${__dirname}/../../../../uploads/convenios/documentos`;
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

  let fil: BussFiles = new BussFiles();
  var filData: any = request.body;

  for (var i = 0; i < key.length; i++) {
    var file: any = files[key[i]];

    // extraer extensión
    var nombreCortado = file.name.split(".");
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // hash del nombre
    var filehash: string = sha1(new Date().toString()).substr(0, 5);

    // LÓGICA SOLO PARA Adenda Y Enmienda
    let tiposConConteo = ["Adenda", "Enmienda"];
    let sufijo = "";

    if (tiposConConteo.includes(filData.typefile)) {
      // contar registros previos del mismo tipo
      let cantidad = 0;

      if (convenioToUpdate.files && convenioToUpdate.files.length > 0) {
        cantidad = convenioToUpdate.files.filter(
          (f) => f.typefile === filData.typefile
        ).length;
      }

      // si ya existe uno o más
      if (cantidad > 0) {
        sufijo = "_" + (cantidad + 1); // Ejemplo: Adenda_2
      }
    }

    // construir nombre final del archivo
    var newname: string = `GAMB_${filehash}_${filData.typefile}${sufijo}.${extensionArchivo}`;
    var totalpath = `${absolutepath}/${newname}`;

    await copyDirectory(totalpath, file);

    // guardar cambios del convenio si fuera necesario
    await convenioToUpdate.save();

    // registrar archivo
    filData["idcv"] = id;
    filData["uriconvenio"] = "getfileconvenio/" + newname;
    filData["patconvenio"] = totalpath;
    filData["namefile"] = newname;
    filData["typefile"] = filData.typefile + sufijo; // asegurar que el tipo se guarde

    var result1 = await fil.addFilecv(filData);
    let idFile = result1._id;

    // adjuntar archivo al convenio
    var result = await convenio.addFiles(id, idFile);

    if (result == null) {
      response.status(300).json({ serverResponse: "no se pudo guardar..." });
      return;
    }
  }

  response.status(200).json({ serverResponse: "se subió con éxito" });
}

  public async getFileConv(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var filecv: BussFiles = new BussFiles();
    var fileData: IFilescv = await filecv.readcv(name);
    if (!fileData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (fileData.patconvenio == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(fileData.patconvenio);
  }
  public async addTransf(request: Request, response: Response) {
    var id: string = request.params.id;
    if (!id) {
      response
        .status(300)
        .json({ serverResponse: "El id es necesario para subir un archivo" });
      return;
    }
    var trsnf: BussConvenio = new BussConvenio();
    var trsnfToUpdate: IConvenio = await trsnf.readConvenio(id);
    if (!trsnfToUpdate) {
      response.status(300).json({ serverResponse: "convenio no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/convenios/transferencias/comprobantes`;
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
    let fil: BussDesem = new BussDesem();
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      var newname: string = `${"GAMB"}_${filehash}_${trsnfToUpdate.codigo
        }.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      var hojaResult: IConvenio = await trsnfToUpdate.save();
      filData["idcv"] = id;
      filData["uricompro"] = "getcomprobante/" + newname;
      filData["pathcompro"] = totalpath;
      filData["namefile"] = newname;
      var result1 = await fil.addDesem(filData);
      let idFile = result1._id;
      var result = await trsnf.addDesem(id, idFile);
      if (result == null) {
        response.status(300).json({ serverResponse: "no se pudo guardar..." });
        return;
      }
      response.status(200).json({ serverResponse: "se subió con éxito" });
    }
  }
  public async getTransf(request: Request, response: Response) {
    var name: string = request.params.name;
    if (!name) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var filecv: BussDesem = new BussDesem();
    var fileData: ITransferencia = await filecv.readtranf(name);
    if (!fileData) {
      response.status(300).json({ serverResponse: "Error " });
      return;
    }
    if (fileData.pathcompro == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(fileData.pathcompro);
  }
  //*--------------Desembolso------------------- *//
  public async createDesem(request: Request, response: Response) {
    var desem: BussTransf = new BussTransf();

    var desemData = request.body;
    let result = await desem.addDesem(desemData);
    response.status(201).json({ serverResponse: result });
  }

  public async getDesem(request: Request, response: Response) {
    var desem: BussTransf = new BussTransf();
    const result: Array<ITransferencia> = await desem.readDesem();
    response.status(200).json(result);
  }
  public async updateDesem(request: Request, response: Response) {
    var desem: BussTransf = new BussTransf();
    let id: string = request.params.id;
    var params = request.body;
    var result = await desem.updateDesem(id, params);
    response.status(200).json(result);
  }
  public async removeDesem(request: Request, response: Response) {
    var desem: BussTransf = new BussTransf();
    let id: string = request.params.id;
    let result = await desem.deleteDesem(id);
    response.status(200).json({ serverResponse: "Se elimino el Desembolso" });
  }
  //*--------------EstadoMomto------------------- *//
  public async createEstmonto(request: Request, response: Response) {
    var desem: BussEstadoMonto = new BussEstadoMonto();

    var entidadData = request.body;
    let result = await desem.addEstmonto(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getEstmonto(request: Request, response: Response) {
    var desem: BussEstadoMonto = new BussEstadoMonto();
    const result: Array<IEstmonto> = await desem.readEstmonto();
    response.status(200).json(result);
  }
  public async updateEstmonto(request: Request, response: Response) {
    var desem: BussEstadoMonto = new BussEstadoMonto();
    let id: string = request.params.id;
    var params = request.body;
    var result = await desem.updateEstmonto(id, params);
    response.status(200).json(result);
  }
  public async removeEstmonto(request: Request, response: Response) {
    var desem: BussEstadoMonto = new BussEstadoMonto();
    let id: string = request.params.id;
    let result = await desem.deleteEstmonto(id);
    response.status(200).json({ serverResponse: "Se elimino el EstadoMonto" });
  }
  ///-------FILE---------//
  public async getFilescv(request: Request, response: Response) {
    var files: BussFiles = new BussFiles();
    const result: Array<IFilescv> = await files.readFile();
    response.status(200).json(result);
  }

  //----------ENTITIE------------//
  public async createEntity(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    var entidadData = request.body;
    let result = await entity.addEntity(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getEntities(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    const result: Array<IEntity> = await entity.readEntity();
    response.status(200).json(result);
  }
  public async getEntity(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    let repres = await entity.readEntity(request.params.id);
    response.status(200).json(repres);
  }
  public async getEntityCod(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    let codigo = request.params.codigo;
    let repres = await entity.readEntityCod(codigo);
    response.status(200).json(repres);
  }
  public async queryEntidades(request: Request, response: Response) {
    try {
      const entity: BussEntity = new BussEntity();
      const params: any = request.query;

      // 🔹 Armamos el filtro
      const filter: any = {};

      if (params.deFecha || params.alFecha) {
        filter.fechaRegistro = {};
        if (params.deFecha)
          filter.fechaRegistro.$gte = new Date(params.deFecha);
        if (params.alFecha)
          filter.fechaRegistro.$lte = new Date(params.alFecha);
      }

      if (params.estado) filter.estado = params.estado;
      if (params.isReposicion) filter.isReposicion = params.isReposicion;
      if (params.gestion) filter.gestion = params.gestion;
      if (params.tipoFondo) filter.tipoFondo = params.tipoFondo;
      if (params.tipoGasto) filter.tipoGasto = params.tipoGasto;
      if (params.fuente) filter.fuente = params.fuente;
      if (params.partida) filter.partida = params.partida;
      if (params.catProgra) filter.catProgra = params.catProgra;
      if (params.solicitante) filter.solicitante = params.solicitante;
      if (params.encargado) filter.encargado = params.encargado;
      if (params.numDescargo) filter.numDescargo = params.numDescargo;

      // 🔹 Orden y paginación
      const order: any = { fechaRegistro: -1, _id: -1 };
      const limit = params.limit;
      const skip = params.skip ? parseInt(params.skip, 10) : 0;
      log("filter", filter);
      // 🔹 Listado de entidades
      const entidades = await entity.readEntity(filter, skip, limit, order);
      return response.status(200).json({
        filter,
        entidades,
      });
    } catch (error) {
      console.error("❌ Error en queryEntidades:", error);
      return response.status(500).json({
        message: "Error consultando entidades",
        error,
      });
    }
  }

  public async updateEntity(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    let id: string = request.params.id;
    var params = request.body;
    var result = await entity.updateEntity(id, params);
    response.status(200).json(result);
  }
  public async removeEntity(request: Request, response: Response) {
    var entity: BussEntity = new BussEntity();
    let id: string = request.params.id;
    let result = await entity.deleteEntity(id);
    response.status(200).json({ serverResponse: "Se elimino la entidad" });
  }
  //*--------------Financiadoras------------------- *//
  public async createFinanc(request: Request, response: Response) {
    var financ: BussFinanc = new BussFinanc();

    var entidadData = request.body;
    let result = await financ.addFinanc(entidadData);
    response.status(201).json({ serverResponse: result });
  }

  public async getFinanc(request: Request, response: Response) {
    var financ: BussFinanc = new BussFinanc();
    const result: Array<IFinaciadoras> = await financ.readFinanc();
    response.status(200).json(result);
  }
  public async getFinan(request: Request, response: Response) {
    var financ: BussFinanc = new BussFinanc();
    let repres = await financ.readFinanc(request.params.id);
    response.status(200).json(repres);
  }
  public async updateFinanc(request: Request, response: Response) {
    var financ: BussFinanc = new BussFinanc();
    let id: string = request.params.id;
    var params = request.body;
    var result = await financ.updateFinanc(id, params);
    response.status(200).json("Se modificó con éxito");
  }
  public async removeFinanc(request: Request, response: Response) {
    var financ: BussFinanc = new BussFinanc();
    let id: string = request.params.id;
    let result = await financ.deleteFinanc(id);
    response.status(200).json({ serverResponse: "Se elimino el EstadoMonto" });
  }
  //----------PARTIDAS------------//
  public async createPartida(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    var entidadData = request.body;
    let result = await partida.addPartida(entidadData);
    response.status(201).json({ serverResponse: result });
  }
  public async getPartidas(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    const result: Array<IPartidas> = await partida.readPartida();
    response.status(200).json(result);
  }
  public async getPartidasAlm(request: Request, response: Response) {
    var SubCategoria: BussPartida = new BussPartida();
    var filter: any = {};
    var params: any = request.query;
    var aux: any = {};
    var order: any = {};
    if (params.codgt != null) {
      var gt = params.codgt;
      aux["$gt"] = gt;
    }
    if (params.codlt != null) {
      var lt = params.codlt;
      aux["$lt"] = lt;
    }
    if (Object.entries(aux).length > 0) {
      filter["codigo"] = aux;
    }
    if (params.order != null) {
      var data = params.order.split(",");
      var number = parseInt(data[1]);
      order[data[0]] = number;
    } else {
      order = { _id: -1 };
    }
    let res: Array<IPartidas> = await SubCategoria.readPartida(
      filter,
      order
    );
    response.status(200).json({
      serverResponse: res,
    });
    return;
  }
  public async getPartida(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    let repres = await partida.readPartida(request.params.id);
    response.status(200).json(repres);
  }
  public async getPartidaCod(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    let codigo: number = parseInt(request.params.codigo);
    let repres = await partida.readPartidaCod(codigo);
    response.status(200).json(repres);
  }
  public async updatePartida(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    let id: string = request.params.id;
    var params = request.body;
    var result = await partida.updatePartida(id, params);
    response.status(200).json(result);
  }
  public async removePartida(request: Request, response: Response) {
    var partida: BussPartida = new BussPartida();
    let id: string = request.params.id;
    let result = await partida.deletePartida(id);
    response
      .status(200)
      .json({ serverResponse: "Se elimino un partida de Gasto" });
  }
  //----------RUBROS------------//
  public async createRubro(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    var entidadData = request.body;
    let result = await partida.addRubro(entidadData);
    response.status(201).json({ serverResponse: result });
  }
  public async getRubros(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    const result: Array<IRubros> = await partida.readRubro();
    response.status(200).json(result);
  }
  public async getRubro(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    let repres = await partida.readRubro(request.params.id);
    response.status(200).json(repres);
  }
  public async getRubroCod(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    let codigo: number = parseInt(request.params.codigo);
    let repres = await partida.readRubroCod(codigo);
    response.status(200).json(repres);
  }
  public async updateRubro(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    let id: string = request.params.id;
    var params = request.body;
    var result = await partida.updateRubro(id, params);
    response.status(200).json(result);
  }
  public async removeRubro(request: Request, response: Response) {
    var partida: BussRubro = new BussRubro();
    let id: string = request.params.id;
    let result = await partida.deleteRubro(id);
    response.status(200).json({ serverResponse: "Se elimino Rubro" });
  }
}
export default RoutesController;
