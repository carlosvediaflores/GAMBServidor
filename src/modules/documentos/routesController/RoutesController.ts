import { Request, Response } from "express";
import sha1 from "sha1";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";

import { IModelo } from "../models/modelos";
import BussModelo from "../bussinesController/modelo";
import BussDocument from "../bussinesController/documentos";
import { IDocumento } from "../models/documentos";
import { INormativa } from "../models/normativa";
import BussNormativa from "../bussinesController/normativa";
import BussTipoNormativa from "../bussinesController/tipoNormativa";
import { ITipoNormativa } from "../models/tipoNormativa";
import BussPrestamo from "../bussinesController/prestamos";
import { IPrestamos } from "../models/prestamos";
import BussFilePrestamo from "../bussinesController/filePrestamo";
import { IFilePrestamos } from "../models/filePrestamo";
import BussAmortizacion from "../bussinesController/amortizacion";
import { IAmortizacion } from "../models/amortizacion";
import BussEjecucion from "../bussinesController/ejecucionPres";
import { IEjecucion } from "../models/ejecucionPres";
import BussEjecucionFile from "../bussinesController/ejecucionFile";
import { IEjecucionFile } from "../models/ejecucionFile";

class RoutesController {
  //----------MODELOS------------//

  //Crear Modelo
  public async createModelo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    var ModeloData = request.body;
    let result = await Modelo.addModelo(ModeloData);
    response.status(201).json({ serverResponse: result });
  }

  //Listar Filtrar
  public async getModelos(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let res: Array<IModelo> = await Modelo.readModelo();
    response.status(200).json({
      serverResponse: res,
      totalDocs: res.length,
    });
    return;
  }
  // Buscar por Id Modelos
  public async getModelo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let result = await Modelo.readModelo(request.params.id);
    response.status(200).json(result);
  }
  public async updateModelo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Modelo.updateModelo(id, params);
    response.status(200).json(result);
  }
  /*  public async addTipo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Modelo.addTipo(id, params);
    response.status(200).json(result);
  } */
  /* public async removeTipo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Modelo.removeTipo(id, params);
    response.status(200).json(result);
  } */
  public async removeModelo(request: Request, response: Response) {
    var Modelo: BussModelo = new BussModelo();
    let id: string = request.params.id;
    let result = await Modelo.deleteModelo(id);
    response.status(200).json({ serverResponse: "Se elimino Modelo" });
  }
  /////DOCUMENTS
  //listar buscar filtrar
  public async getDocuments(request: Request, response: Response) {
    var Document: BussDocument = new BussDocument();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.titulo != null) {
      var titulo = new RegExp(params.titulo, "i");
      filter["titulo"] = titulo;
    }
    if (params.vigente != null) {
      var vigente = params.vigente;
      filter["vigente"] = vigente;
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
    let respost: Array<IDocumento> = await Document.readDocument();
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
    let res: Array<IDocumento> = await Document.readDocument(
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
  //buscar por Id a document
  public async getDocument(request: Request, response: Response) {
    var Document: BussDocument = new BussDocument();
    //let id: string = request.params.id;
    let res = await Document.readDocument(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  //Crear Subir Modificar Modelo de Documento
  public async uploadDocument(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Document: BussDocument = new BussDocument();
    var Modelo: BussModelo = new BussModelo();
    var id: string = request.params.id;
    var resultPrestamo: IDocumento = await Document.readDocument(id);
    var filData: any = request.body;
    if (!resultPrestamo) {
      response.status(300).json({ serverResponse: "Document no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      if (resultPrestamo.modelo_tipo == filData.modelo_tipo) {
        var Result = await Document.updateDocument(id, filData);
      } else {
        var Result = await Document.updateDocument(id, filData);
        let idModel = filData.modelo_tipo;
        let idModelAnterior = resultPrestamo.modelo_tipo;
        let pushDoc = await Modelo.updatePushDoc(idModel, id);
        var result = await Modelo.removeDocId(idModelAnterior, id);
      }
      response.status(200).json({ serverResponse: "Document modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      var Documento: IDocumento = await Document.addDocument(filData);
      let idModel = filData.modelo_tipo;
      let idDoc = Documento._id;
      let pushDoc = await Modelo.updatePushDoc(idModel, idDoc);
      response.status(300).json({ serverResponse: Documento });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/plantillas`;
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
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = [
          "pdf",
          "docx",
          "xlsx",
          "xlsm",
          "pptx",
          "xls",
          "rar",
        ];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${
          filData.titulo
        }_${filehash}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getDocument/" + newname;
        filData.path = totalpath;
        filData.nameFile = newname;
        var Documento: IDocumento = await Document.addDocument(filData);
        let idModel = filData.modelo_tipo;
        let idDoc = Documento._id;
        let pushDoc = await Modelo.updatePushDoc(idModel, idDoc);
      }
      response.status(200).json({
        serverResponse: Documento,
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
      var extensionesValidas = [
        "pdf",
        "docx",
        "xlsx",
        "xlsm",
        "pptx",
        "xls",
        "rar",
      ];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${
        filData.titulo
      }_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      pathViejo = resultPrestamo.path;
      filData.path = totalpath;
      if (totalpath != resultPrestamo.path) {
        borrarImagen(pathViejo);
      }
      filData.uri = "getDocument/" + newname;
      filData.nameFile = newname;
      if (resultPrestamo.modelo_tipo == filData.modelo_tipo) {
        var Result = await Document.updateDocument(id, filData);
      } else {
        var Result = await Document.updateDocument(id, filData);
        let idModel = filData.modelo_tipo;
        let idModelAnterior = resultPrestamo.modelo_tipo;
        let pushDoc = await Modelo.updatePushDoc(idModel, id);
        var result = await Modelo.removeDocId(idModelAnterior, id);
      }
      response.status(200).json({ serverResponse: "Document modificado" });
      return;
    }
    pathViejo = filData.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  //Ver Archivo
  public async getFileDocument(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Document: BussDocument = new BussDocument();
    var DocumentoData: IDocumento = await Document.readDocumentFile(uri);
    if (!DocumentoData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(DocumentoData.path);
  }
  //Elinimar
  public async removeDocument(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Document: BussDocument = new BussDocument();
    var Modelo: BussModelo = new BussModelo();
    let id: string = request.params.id;
    let res: IDocumento = await Document.readDocument(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let result = await Document.deleteDocument(id);
    var result1 = await Modelo.removeDocId(res.modelo_tipo, id);
    response.status(200).json({ serverResponse: "Se elimino la Plantilla" });
  }

  //----------TIPOS NORMATIVAS------------//

  //Crear
  public async createTipoNormativa(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    var TipoNormativaData = request.body;
    let result = await TipoNormativa.addTipoNormativa(TipoNormativaData);
    response.status(201).json({ serverResponse: result });
  }

  //Listar Filtrar
  public async getTipoNormativas(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let res: Array<ITipoNormativa> = await TipoNormativa.readTipoNormativa();
    response.status(200).json({
      serverResponse: res,
      totalDocs: res.length,
    });
    return;
  }
  // Buscar por Id TipoNormativas
  public async getTipoNormativa(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let result = await TipoNormativa.readTipoNormativa(request.params.id);
    response.status(200).json(result);
  }
  public async updateTipoNormativa(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let id: string = request.params.id;
    var params = request.body;
    var result = await TipoNormativa.updateTipoNormativa(id, params);
    response.status(200).json(result);
  }
  /*  public async addTipo(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let id: string = request.params.id;
    var params = request.body;
    var result = await TipoNormativa.addTipo(id, params);
    response.status(200).json(result);
  } */
  /* public async removeTipo(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let id: string = request.params.id;
    var params = request.body;
    var result = await TipoNormativa.removeTipo(id, params);
    response.status(200).json(result);
  } */
  public async removeTipoNormativa(request: Request, response: Response) {
    var TipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let id: string = request.params.id;
    let result = await TipoNormativa.deleteTipoNormativa(id);
    response.status(200).json({ serverResponse: "Se elimino TipoNormativa" });
  }

  /////NORMATIVAS
  //listar buscar filtrar
  public async getNormativas(request: Request, response: Response) {
    var Normativa: BussNormativa = new BussNormativa();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.titulo != null) {
      var titulo = new RegExp(params.titulo, "i");
      filter["titulo"] = titulo;
    }
    if (params.vigente != null) {
      var vigente = params.vigente;
      filter["vigente"] = vigente;
    }
    if (params.estado != null) {
      var estado = params.estado;
      filter["estado"] = estado;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
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
      filter["createdAt"] = aux;
    }
    let respost: Array<INormativa> = await Normativa.readNormativa();
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
      order = { tipo_normativa: -1, numero: 1 };
    }
    let res: Array<INormativa> = await Normativa.readNormativa(
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
  //buscar por Id a Normativa
  public async getNormativa(request: Request, response: Response) {
    var Normativa: BussNormativa = new BussNormativa();
    //let id: string = request.params.id;
    let res = await Normativa.readNormativa(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  //Crear Subir Modificar Normativa
  public async uploadNormativa(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Normativa: BussNormativa = new BussNormativa();
    var tipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    var id: string = request.params.id;
    var NormativaToUpdate: INormativa = await Normativa.readNormativa(id);
    var filData: any = request.body;
    if (!NormativaToUpdate) {
      response.status(300).json({ serverResponse: "Normativa no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      //si tipoNormativa no se ha cambiado
      if (NormativaToUpdate.tipo_normativa == filData.tipo_normativa) {
        var Result = await Normativa.updateNormativa(id, filData);
      } else if (filData.tipo_normativa == null) {
        var Result = await Normativa.updateNormativa(id, filData);
      } else {
        var Result = await Normativa.updateNormativa(id, filData);
        let idTipo = filData.tipo_normativa;
        let idTipoAnterior = NormativaToUpdate.tipo_normativa;
        let pushDoc = await tipoNormativa.updatePushNormativa(idTipo, id);
        var result = await tipoNormativa.removeNormativaId(idTipoAnterior, id);
      }
      response.status(200).json({ serverResponse: "Normativa modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      var normativa: INormativa = await Normativa.addNormativa(filData);
      let idTipo = filData.tipo_normativa;
      let idDoc = normativa._id;
      let pushDoc = await tipoNormativa.updatePushNormativa(idTipo, idDoc);
      response.status(300).json({ serverResponse: normativa });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/plantillas`;
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
      for (var i = 0; i < key.length; i++) {
        var file: any = files[key[i]];
        var filehash: string = sha1(new Date().toString()).substr(0, 5);
        var nombreCortado = file.name.split(".");
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        // Validar extension
        var extensionesValidas = [
          "pdf",
          "docx",
          "xlsx",
          "xlsm",
          "pptx",
          "xls",
          "rar",
        ];
        if (!extensionesValidas.includes(extensionArchivo)) {
          return response.status(400).json({
            ok: false,
            msg: "No es una extensión permitida",
          });
        }
        var newname: string = `${"GAMB"}_${
          filData.titulo
        }_${filehash}.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.uri = "getNormativa/" + newname;
        filData.path = totalpath;
        filData.nameFile = newname;
        var normativa: INormativa = await Normativa.addNormativa(filData);
        let idTipo = filData.tipo_normativa;
        let idDoc = normativa._id;
        let pushDoc = await tipoNormativa.updatePushNormativa(idTipo, idDoc);
      }
      response.status(200).json({
        serverResponse: normativa,
      });
      return;
    }
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = [
        "pdf",
        "docx",
        "xlsx",
        "xlsm",
        "pptx",
        "xls",
        "rar",
      ];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${
        filData.titulo
      }_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      pathViejo = NormativaToUpdate.path;
      filData.path = totalpath;
      if (totalpath != NormativaToUpdate.path) {
        borrarImagen(pathViejo);
      }
      filData.uri = "getNormativa/" + newname;
      filData.nameFile = newname;
      if (NormativaToUpdate.tipo_normativa == filData.tipo_normativa) {
        var Result = await Normativa.updateNormativa(id, filData);
      } else {
        var Result = await Normativa.updateNormativa(id, filData);
        let idTipo = filData.tipo_normativa;
        let idTipoAnterior = NormativaToUpdate.tipo_normativa;
        let pushDoc = await tipoNormativa.updatePushNormativa(idTipo, id);
        var result = await tipoNormativa.removeNormativaId(idTipoAnterior, id);
      }
      response.status(200).json({ serverResponse: "Normativa modificado" });
      return;
    }
    pathViejo = filData.path;
    borrarImagen(pathViejo);
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  //Ver Archivo
  public async getFileNormativa(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Normativa: BussNormativa = new BussNormativa();
    var NormativaoData: INormativa = await Normativa.readNormativaFile(uri);
    if (!NormativaoData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(NormativaoData.path);
  }
  //Elinimar
  public async removeNormativa(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Normativa: BussNormativa = new BussNormativa();
    var tipoNormativa: BussTipoNormativa = new BussTipoNormativa();
    let id: string = request.params.id;
    let res: INormativa = await Normativa.readNormativa(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let result = await Normativa.deleteNormativa(id);
    var result1 = await tipoNormativa.removeNormativaId(res.tipo_normativa, id);
    response.status(200).json({ serverResponse: "Se elimino la Normativa" });
  }

  ///////////PRESTAMOS///////////
  //Crear Prestamo
  public async createPrestamo(request: Request, response: Response) {
    var Prestamo: BussPrestamo = new BussPrestamo();
    var PrestamoData = request.body;
    PrestamoData.saldoA = PrestamoData.monto;
    let result = await Prestamo.addPrestamo(PrestamoData);
    response.status(201).json({ serverResponse: result });
  }
  //listar buscar filtrar
  public async getPrestamos(request: Request, response: Response) {
    var Prestamo: BussPrestamo = new BussPrestamo();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.nombre != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter["nombre"] = nombre;
    }
    if (params.tipo != null) {
      var tipo = params.tipo;
      filter["tipo"] = tipo;
    }
    if (params.estado != null) {
      var estado = params.estado;
      filter["estado"] = estado;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
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
      filter["createdAt"] = aux;
    }
    let respost: Array<IPrestamos> = await Prestamo.readPrestamo();
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
    let res: Array<IPrestamos> = await Prestamo.readPrestamo(
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
  //buscar por Id a Prestamo
  public async getPrestamo(request: Request, response: Response) {
    var prestamo: BussPrestamo = new BussPrestamo();
    //let id: string = request.params.id;
    let res = await prestamo.readPrestamo(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  //editar Prestamo
  public async updatePrestamo(request: Request, response: Response) {
    var prestamo: BussPrestamo = new BussPrestamo();
    let id: string = request.params.id;
    var params = request.body;
    let res = await prestamo.readPrestamo(request.params.id);
    if (params.monto == res.monto) {
      var result = await prestamo.updatePrestamo(id, params);
      response.status(200).json({
        serverResponse: "Préstamo actualizado",
      });
      return;
    } else {
      let saldoAct = 0;
      if (params.monto < res.monto) {
        saldoAct = res.monto - params.monto;
        params.saldoA = res.saldoA - saldoAct;
        var result = await prestamo.updatePrestamo(id, params);
        response.status(200).json({
          serverResponse: "Préstamo actualizado",
        });
        return;
      } else {
        saldoAct = params.monto - res.monto;
        params.saldoA = res.saldoA + saldoAct;
        var result = await prestamo.updatePrestamo(id, params);
        response.status(200).json({
          serverResponse: "Préstamo actualizado",
        });
        return;
      }
    }
  }
  //eliminar Prestamo
  public async removePrestamo(request: Request, response: Response) {
    var prestamo: BussPrestamo = new BussPrestamo();
    let id: string = request.params.id;
    let res = await prestamo.readPrestamo(request.params.id);
    if (res.archivos.length > 0 || res.amortizacion.length > 0) {
      response.status(300).json({
        serverResponse: "Ya existe registrado archivo o amortización",
      });
      return;
    } else {
      let result = await prestamo.deletePrestamo(id);
      response.status(200).json({ serverResponse: "Se elimino prestamo" });
    }
  }
  //agregar Archivo a Prestamo
  public async addArchivo(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    let idPrestamo: string = request.params.id;
    var Prestamo: BussPrestamo = new BussPrestamo();
    let filePrestamo: BussFilePrestamo = new BussFilePrestamo();
    if (!idPrestamo) {
      response.status(300).json({ serverResponse: "El id es necesario" });
      return;
    }
    let prestamoResult = await Prestamo.readPrestamo(idPrestamo);
    var prestaData: any = request.body;
    let result: any = {};
    let result1: any = {};
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "no existe archivo adjunto" });
      return;
    }
    //SUBIR Archivo
    var dir = `${__dirname}/../../../../uploads/documentos`;
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
    //para area de contabilidad con file
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
      var newname: string = `${"GAMB"}_${prestaData.documento}_${
        prestamoResult.tipo
      }_${"Nro"}${prestamoResult.numero}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      prestaData.nameFile = newname;
      prestaData.uri = "getFilePrestamo/" + newname;
      prestaData.path = totalpath;
      var resultFilePresta = await filePrestamo.addFilePrestamo(prestaData);
      let idArchivo = resultFilePresta._id;
      var addFile = await Prestamo.updatePushPrestamo(idPrestamo, idArchivo);
      response.status(201).json({ serverResponse: resultFilePresta });
      return;
    }
    //response.status(200).json({ serverResponse: resultPresta });
  }
  //Ver Archivo
  public async getFilePrestamo(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Document: BussFilePrestamo = new BussFilePrestamo();
    var DocumentoData: IFilePrestamos = await Document.readFilePrestamo(uri);
    if (!DocumentoData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(DocumentoData.path);
  }
  //Elinimar FilePrestamo
  public async removeFilePrestamo(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Prestamo: BussPrestamo = new BussPrestamo();
    let filePrestamo: BussFilePrestamo = new BussFilePrestamo();
    let id: string = request.params.id;
    let res: IFilePrestamos = await filePrestamo.readFilPrestamo(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let result = await filePrestamo.deleteFilePrestamo(id);
    //var result1 = await tipoNormativa.removeNormativaId(res.tipo_normativa, id);
    response.status(200).json({ serverResponse: "Se elimino el documento" });
  }
  /////////Amortizacion///////
  //Listar
  public async getAmortizacions(request: Request, response: Response) {
    var Modelo: BussAmortizacion = new BussAmortizacion();
    let res: Array<IAmortizacion> = await Modelo.readAmortizacion();
    response.status(200).json({
      serverResponse: res,
      totalDocs: res.length,
    });
    return;
  }
  //Crear Subir Modificar Amortizacion
  public async uploadAmortizacion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var amortizacion: BussAmortizacion = new BussAmortizacion();
    var Prestamo: BussPrestamo = new BussPrestamo();
    var id: string = request.params.id;
    var resultPrestamo: IPrestamos = await Prestamo.readPrestamo(id);
    var filData: any = request.body;
    if (!resultPrestamo) {
      response.status(300).json({ serverResponse: "Prestamo no existe!" });
      return;
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "no existe archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/documentos`;
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
    var filData: any = request.body;
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["pdf", "jpg", "jpeg"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filehash}_${
        resultPrestamo.tipo
      }_${"Nro"}${resultPrestamo.numero}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      let resultSaldoPres = resultPrestamo.saldoA - filData.monto;
      if (filData.monto > resultPrestamo.saldoA) {
        response
          .status(300)
          .json({ serverResponse: "El monto no debe superar el Saldo" });
        return;
      } else {
        const filDataPre: any = { saldoA: resultSaldoPres };
        filData.nameFile = newname;
        filData.uri = "getFileAmortizacion/" + newname;
        filData.path = totalpath;
        var resultFilePresta = await amortizacion.addAmortizacion(filData);
        let idArchivo = resultFilePresta._id;
        var updatePres = await Prestamo.updatePrestamo(id, filDataPre);
        var addFile = await Prestamo.updatePushAmortizacion(id, idArchivo);
        var addFile = await amortizacion.updatePusPrestamo(idArchivo, id);
        response.status(201).json({ serverResponse: resultFilePresta });
        return;
      }
    }
  }
  //Elinimar FilePrestamo
  public async removeAmortizacion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var amortizacion: BussAmortizacion = new BussAmortizacion();
    var Prestamo: BussPrestamo = new BussPrestamo();
    let id: string = request.params.id;
    let res: IAmortizacion = await amortizacion.readAmortizacion(id);
    if (!res) {
      response.status(300).json({ serverResponse: "Amortizacion no existe!" });
      return;
    }
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let idPres: any = res.prestamo;
    var resultPrestamo: any = await Prestamo.readPrestamo(idPres[0]);
    let saldoPres: {} = resultPrestamo;
    let resultSaldoPres = res.monto + resultPrestamo[0].saldoA;
    const filDataPre = { saldoA: resultSaldoPres };
    let result = await amortizacion.deleteAmortizacion(id);
    var updatePres = await Prestamo.updatePrestamo(idPres[0], filDataPre);
    var result1 = await Prestamo.removeAmortizacionId(idPres[0], id);
    response.status(200).json({ serverResponse: "Se elimino el documento" });
  }
  //Ver Archivo Amortizacion
  public async getFileAmortizacion(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var amortizacion: BussAmortizacion = new BussAmortizacion();
    let res: IAmortizacion = await amortizacion.readAmortizacionFile(uri);
    if (!res) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(res.path);
  }
  ///////////EJECUCION///////////
  //Crear Ejecucion
  public async createEjecucion(request: Request, response: Response) {
    var Ejecucion: BussEjecucion = new BussEjecucion();
    var EjecucionData = request.body;
    let result = await Ejecucion.addEjecucion(EjecucionData);
    response.status(201).json({ serverResponse: result });
  }
  //listar buscar filtrar
  public async getEjecucions(request: Request, response: Response) {
    var Ejecucion: BussEjecucion = new BussEjecucion();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.nombre != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter["nombre"] = nombre;
    }
    if (params.tipo != null) {
      var tipo = params.tipo;
      filter["tipo"] = tipo;
    }
    if (params.estado != null) {
      var estado = params.estado;
      filter["estado"] = estado;
    }
    if (params.limit) {
      limit = parseInt(params.limit);
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
      filter["createdAt"] = aux;
    }
    let respost: Array<IEjecucion> = await Ejecucion.readEjecucion();
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
    let res: Array<IEjecucion> = await Ejecucion.readEjecucion(
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
  //buscar por Id a Ejecucion
  public async getEjecucion(request: Request, response: Response) {
    var Ejecucion: BussEjecucion = new BussEjecucion();
    //let id: string = request.params.id;
    let res = await Ejecucion.readEjecucion(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  //editar Ejecucion
  public async updateEjecucion(request: Request, response: Response) {
    var Ejecucion: BussEjecucion = new BussEjecucion();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Ejecucion.updateEjecucion(id, params);
    response.status(200).json({ serverResponse: "Préstamo actualizado" });
  }
  //eliminar Ejecucion
  public async removeEjecucion(request: Request, response: Response) {
    var Ejecucion: BussEjecucion = new BussEjecucion();
    let id: string = request.params.id;
    let res = await Ejecucion.readEjecucion(request.params.id);
    let result = await Ejecucion.deleteEjecucion(id);
    response.status(200).json({ serverResponse: "Se elimino Ejecucion" });
  }
  //agregar Archivo a Ejecucion
  public async addArchivoEjecucion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    let idEjecucion: string = request.params.id;
    var Ejecucion: BussEjecucion = new BussEjecucion();
    let fileEjecucion: BussEjecucionFile = new BussEjecucionFile();
    if (!idEjecucion) {
      response.status(300).json({ serverResponse: "El id es necesario" });
      return;
    }
    let EjecucionResult = await Ejecucion.readEjecucion(idEjecucion);
    var ejecucionData: any = request.body;
    let result: any = {};
    let result1: any = {};
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "no existe archivo adjunto" });
      return;
    }
    //SUBIR Archivo
    var dir = `${__dirname}/../../../../uploads/documentos`;
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
    //para area de contabilidad con file
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      var filehash: string = sha1(new Date().toString()).substr(0, 5);
      var nombreCortado = file.name.split(".");
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Validar extension
      var extensionesValidas = ["pdf", "jpg", "jpeg","png"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${ejecucionData.documento}_${filehash}.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      ejecucionData.nameFile = newname;
      ejecucionData.uri = "getEjecucionFile/" + newname;
      ejecucionData.path = totalpath;
      var resultFilePresta = await fileEjecucion.addEjecucionFile(ejecucionData);
      let idArchivo = resultFilePresta._id;
      var addFile = await Ejecucion.updatePushEjecucion(idEjecucion, idArchivo);
      response.status(201).json({ serverResponse: resultFilePresta });
      return;
    }
    //response.status(200).json({ serverResponse: resultPresta });
  }
  //Ver Archivo
  public async getFileEjecucion(request: Request, response: Response) {
    var uri: string = request.params.name;
    if (!uri) {
      response
        .status(300)
        .json({ serverResponse: "Identificador no encontrado" });
      return;
    }
    var Document: BussEjecucionFile = new BussEjecucionFile();
    var DocumentoData: IEjecucionFile = await Document.readEjecucionFil(uri);
    if (!DocumentoData) {
      const pathImg = path.join(
        __dirname,
        `/../../../../uploads/no-hay-archivo.png`
      );
      response.sendFile(pathImg);
      return;
    }
    response.sendFile(DocumentoData.path);
  }
  //Elinimar FileEjecucion
  public async removeFileEjecucion(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Ejecucion: BussEjecucion = new BussEjecucion();
    let fileEjecucion: BussEjecucionFile = new BussEjecucionFile();
    let id: string = request.params.id;
    let res: IEjecucionFile = await fileEjecucion.readEjecucionFile(id);
    pathViejo = res.path;
    borrarImagen(pathViejo);
    let result = await fileEjecucion.deleteEjecucionFile(id);
    //var result1 = await tipoNormativa.removeNormativaId(res.tipo_normativa, id);
    response.status(200).json({ serverResponse: "Se elimino el documento" });
  }
}
export default RoutesController;
