
import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";

import { IEstmonto } from './../models/estadomonto';
import { IDesembolso } from './../models/desembolso';
import { IRepresentante } from './../models/Representante';
import Entidad, {IEntidad, ISimpleEntidad} from "../models/Entidad";
import BussEntidad from "../businesController/Entidad";
import BussRepres from "../businesController/Representante";
import BussConvenio from '../businesController/convenio';
import BussDesem from '../businesController/desembolso';
import BussEstadoMonto from '../businesController/estadomonto';
import { IConvenio } from "../models/convenio";
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
     
       //*--------------Desembolso------------------- *//
       public async createDesem(request: Request, response: Response) {
        var desem: BussDesem = new BussDesem();
    
        var entidadData = request.body;
        let result = await desem.addDesem(entidadData);
        response.status(201).json({ serverResponse: result });
      }

      public async getDesem(request: Request, response: Response) {
        var desem: BussDesem = new BussDesem();
        const result: Array<IDesembolso> = await desem.readDesem();
        response.status(200).json(result);
      }
      public async updateDesem(request: Request, response: Response) {
        var desem: BussDesem = new BussDesem();
        let id: string = request.params.id;
        var params = request.body;
        var result = await desem.updateDesem(id, params);
        response.status(200).json(result);
      }
      public async removeDesem(request: Request, response: Response) {
        var desem: BussDesem = new BussDesem();
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
}
export default RoutesController;