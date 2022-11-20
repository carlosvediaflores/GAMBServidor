
import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";

import { IEstmonto } from './../models/estadomonto';
import { ITransferencia } from './../models/transferencia';
import { IRepresentante } from './../models/Representante';
import Entidad, {IEntidad} from "../models/Entidad";
import BussEntidad from "../businesController/Entidad";
import BussRepres from "../businesController/Representante";
import BussConvenio from '../businesController/convenio';
import BussTransf from '../businesController/tranferencia';
import BussEstadoMonto from '../businesController/estadomonto';
import { IConvenio } from "../models/convenio";
import { IFilescv } from "../models/files";
import BussFiles from "../businesController/files";
import BussDesem from "../businesController/tranferencia";
class RoutesController{
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
        response.status(200).json({ serverResponse: "Se elimino el representante" });
      }
       //*--------------Convenios------------------- *//
       public async createConvenio(request: Request, response: Response) {
        var convenio: BussConvenio = new BussConvenio();
        var entidadData = request.body;
        var enti:any =entidadData.entidades;
        var total = 0;
        enti.forEach(function (ent:any) {
          total=total+ent.monto
        }); 
        entidadData["montototal"] = total;
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
        if ( Object.entries(aux).length > 0) { 
          filter["firma"] = aux;
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
          segui.readConvenio(filter,
            skip,
            limit,
            order),
           segui.total({})
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
      public async getConvenio(request: Request, response: Response) {
        var convenio: BussConvenio = new BussConvenio();
        const result: Array<IConvenio> = await convenio.readConvenio();
        response.status(200).json(result);
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
        var result = await convenio.updateConvenio(id, params);
        response.status(200).json(result);
      }
      public async removeConvenio(request: Request, response: Response) {
        var convenio: BussConvenio = new BussConvenio();
        let id: string = request.params.id;
        let result = await convenio.deleteConvenio(id);
        response.status(200).json({ serverResponse: "Se elimino el Convenio" });
      }
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
          response
            .status(300)
            .json({ serverResponse: "convenio no existe!" });
          return;
        }
        if (isEmpty(request.files)) {
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
        let fil: BussFiles = new BussFiles();
        var filData: any = request.body;
        for (var i = 0; i < key.length; i++) {
          var file: any = files[key[i]];
          var filehash: string = sha1(new Date().toString()).substr(0, 7);
          var newname: string = `${"GAMB"}_${filehash}_${file.name}`;
          var totalpath = `${absolutepath}/${newname}`;
          await copyDirectory(totalpath, file);
          var hojaResult: IConvenio = await convenioToUpdate.save();
          filData["idcv"] = id;
          filData["uriconvenio"] = "getfileconvenio/" + newname;
          filData["patconvenio"] = totalpath;
          filData["namefile"] = newname;
          var result1 = await fil.addFilecv(filData);
          let idFile = result1._id;
          var result = await convenio.addFiles(id, idFile);
          if (result == null) {
            response.status(300).json({ serverResponse: "no se pudo guardar..." });
            return;
          }
          response.status(200).json({ serverResponse: "se subió con éxito" });
        }
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
          response
            .status(300)
            .json({ serverResponse: "convenio no existe!" });
          return;
        }
        if (isEmpty(request.files)) {
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
        let fil: BussDesem = new BussDesem();
        var filData: any = request.body;
        for (var i = 0; i < key.length; i++) {
          var file: any = files[key[i]];
          var filehash: string = sha1(new Date().toString()).substr(0, 7);
          var newname: string = `${"GAMB"}_${filehash}_${file.name}`;
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
    
        var entidadData = request.body;
        let result = await desem.addDesem(entidadData);
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
}
export default RoutesController;