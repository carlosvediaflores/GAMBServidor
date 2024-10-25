import { Request, Response } from "express";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
//import csv from "fast-csv";
import * as csv from "@fast-csv/parse";

import { ICorrespondencia } from "../models/correspondencia";
import BussCorrespondencia from "../bussinesController/correspondencias";
import { IDependemcias } from "../models/dependencias";
import BussDependencia from "../bussinesController/dependencias";
import { ISubTipo } from "../models/subTipo";
import BussSubTipo from "../bussinesController/subTipo";
import { ITipo } from "../models/tipo";
import BussTipo from "../bussinesController/tipos";
import { DateFormatter } from "../helpers";

class RoutesController {
  //* ---------------CorrespondenciaS--------------*//
  public async createCorrespondencia(request: Request, response: Response) {
    const Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    const SubTipo: BussSubTipo = new BussSubTipo();
    const dependencia: BussDependencia = new BussDependencia();
    const Tipo: BussTipo = new BussTipo();
    var CorrespondenciaData = request.body;
    var filter: any = {};
    console.log("data",CorrespondenciaData);
    let result: ICorrespondencia;
    let year = new Date();
    let yearAct = CorrespondenciaData.gestion ?? year.getFullYear();

    CorrespondenciaData.gestion = yearAct;
    if(!CorrespondenciaData.via){
      CorrespondenciaData.via= CorrespondenciaData.idUsuario
    }

    if(CorrespondenciaData.idSubTipo === ''){
      delete CorrespondenciaData.idSubTipo
    }
    if (CorrespondenciaData.gestion != null) {
      var gestion = CorrespondenciaData.gestion;
      filter["gestion"] = gestion;
    }
    if (CorrespondenciaData.idTipo != null) {
      var idTipo = CorrespondenciaData.idTipo;
      filter["idTipo"] = idTipo;
    }
    if (CorrespondenciaData.idSubTipo != null) {
      var idSubTipo = CorrespondenciaData.idSubTipo;
      filter["idSubTipo"] = idSubTipo;
    }
    if (CorrespondenciaData.idDependencia != null) {
      var idDependencia = CorrespondenciaData.idDependencia;
      filter["idDependencia"] = idDependencia;
    }
    let resp: any = await Correspondencia.queryCorresp(filter);
     console.log("Res", filter);

    let resultDependencia = await dependencia.readDependencias(idDependencia);
    let resultSubTipo = await SubTipo.readSubTipo(idSubTipo);
    let resulTipo = await Tipo.readTipo(idTipo);

    let fileName = '';

    
    if (!resp) {
      if(resulTipo.nombreTipo === 'nota'){
        fileName=`${resultDependencia.sigla} Nº ${1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      }else if (resulTipo.nombreTipo === 'decreto') {
          fileName=`${resulTipo.nombreTipo}_${resultSubTipo.nombreSubTipo}} Nº ${1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      } else {
        fileName=`${resulTipo.siglaTipo}_${resultDependencia.sigla} Nº ${1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      }
      CorrespondenciaData.fileName=fileName
      result = await Correspondencia.addCorrespondencia(CorrespondenciaData);
      response.status(201).json({ serverResponse: result });
      return;
    } else {
      CorrespondenciaData.numCite = resp.numCite + 1;
      if(resulTipo.nombreTipo === 'nota'){
        fileName=`${resultDependencia.sigla} Nº ${resp.numCite + 1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      }else if (resulTipo.nombreTipo === 'decreto') {
          fileName=`${resulTipo.nombreTipo}_${resultSubTipo.nombreSubTipo}} Nº ${resp.numCite + 1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      } else {
        fileName=`${resulTipo.siglaTipo}_${resultDependencia.sigla} Nº ${resp.numCite + 1}_${CorrespondenciaData.gestion} ${CorrespondenciaData.referencia}`
      }
      CorrespondenciaData.fileName=fileName
      
      result = await Correspondencia.addCorrespondencia(CorrespondenciaData);
      response.status(201).json({ serverResponse: result });
      return;
    }
  }
  public async buscarUltimo(request: Request, response: Response) {
    const Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    var params: any = request.query;
    var filter: any = {};
    let year = new Date();
    let yearAct = params.gestion ?? year.getFullYear();
    if (params.gestion != null) {
      var gestion = params.gestion;
      filter["gestion"] = gestion;
    }
    if (params.idTipo != null) {
      var idTipo = params.idTipo;
      filter["idTipo"] = idTipo;
    }
    if (params.idSubTipo != null) {
      var idSubTipo = params.idSubTipo;
      filter["idSubTipo"] = idSubTipo;
    }
    if (params.idDependencia != null) {
      var idDependencia = params.idDependencia;
      filter["idDependencia"] = idDependencia;
    }
    let resp: any = await Correspondencia.queryCorresp(filter);
    console.log("Fil", filter);
    console.log("Res", resp);
    response.status(201).json({ serverResponse: resp });
      return;
  }

  public async getCorrespondencias(request: Request, response: Response) {
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var status: boolean = true;
    var skip = 0;
    var aux: any = {};
    var order: any = { gestion: -1 };
   
    if (params.gestion != null) {
      var gestion = params.gestion;
      filter["gestion"] = gestion;
    }
    if (params.idTipo != null) {
      var idTipo = params.idTipo;
      filter["idTipo"] = idTipo;
    }
    if (params.idSubTipo != null) {
      var idSubTipo = params.idSubTipo;
      filter["idSubTipo"] = idSubTipo;
    }
    if (params.idDependencia != null) {
      var idDependencia = params.idDependencia;
      filter["idDependencia"] = idDependencia;
    }
    if (params.numCite != null) {
      let numCite = params.numCite;
      filter["numCite"] = numCite;
    }
    if (params.referencia != null) {
      var referencia = new RegExp(params.referencia, "i");
      filter["referencia"] = referencia;
    }
    if (params.hojaRuta != null) {
      let hojaDeRuta = new RegExp(params.hojaRuta, "i");
      filter["hojaRuta"] = hojaDeRuta;
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
    let totalCorrespondencia: any = await Correspondencia.total(filter);
    var totalDocs = totalCorrespondencia;
    var totalpage = Math.ceil(totalCorrespondencia / limit);
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
      order = { gestion: -1, numCorrespondencia: 1 };
    }
    let res: Array<ICorrespondencia> =
      await Correspondencia.readCorrespondencia(filter, skip, limit, order);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
      order,
    });
    return;
  }
  //get Correspondencia con id
  public async getCorrespondencia(request: Request, response: Response) {
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    //let id: string = request.params.id;
    let res = await Correspondencia.readCorrespondencia(request.params.id);
    response.status(200).json({ serverResponse: res });
  }
  public async getNota(request: Request, response: Response) {
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    let res: any = await Correspondencia.getFile(request.params.fileName); 
      console.log(res);
      let sigla = '';
      let siglaTipo = '';
      let nombreTipo = '';
      let nombreSubTipo = '';
      let viaNombre = '';
      let viaCargo = '';
      let vistoBueno = '';
      let de = `${res.idUsuario.username?? ''} ${res.idUsuario.surnames?? ''}`;
      let simpleUser = '';
      const namePartsDe = de.split(' ');
      simpleUser = namePartsDe
      .filter(part => part.length > 0)  // Asegura que solo usemos palabras válidas
      .map(part => part[0].toUpperCase())  // Obtiene la primera letra de cada palabra y la convierte en mayúscula
      .join('');  // Une todas las iniciales en un solo string
      console.log("initials",vistoBueno);
      if(res.idSubTipo){
        nombreSubTipo=  res.idSubTipo.nombreSubTipo.toUpperCase()
      }
      if(res.via){
        viaNombre=`${res.via.username?? ''} ${res.via.surnames}`
        viaCargo=res.via.post
        //vistoBueno=res.via.username
        const namePartsVia = viaNombre.split(' ');
        vistoBueno = namePartsVia
        .filter(part => part.length > 0)  // Asegura que solo usemos palabras válidas
        .map(part => part[0].toUpperCase())  // Obtiene la primera letra de cada palabra y la convierte en mayúscula
        .join('');  // Une todas las iniciales en un solo string
        console.log("initials",vistoBueno);
        
      }
    const newRes: any = {
      lugar: res.lugar,    
      fecha: DateFormatter.getDDMMMMYYYY(res.fecha),
      numCite: res.numCite,
      lugarDestino: res.lugarDestino,
      gestion: res.gestion,
      nombreDestino: res.nombreDestino,
      cargoDestino: res.cargoDestino,
      referencia: res.referencia,
      hojaRuta: res.hojaRuta,
      fsAdjunto: res.fsAdjunto?? '',
      sigla:res.idDependencia.sigla,
      siglaTipo:res.idTipo.siglaTipo?? '',
      nombreTipo:res.idTipo.nombreTipo.toUpperCase() ?? '',
      nombreSubTipo:nombreSubTipo,
      viaNombre:viaNombre,
      viaCargo:viaCargo?? '',
      nombreUsuario:`${res.idUsuario.username?? ''} ${res.idUsuario.surnames?? ''}`,
      cargoUsuario:res.idUsuario.post?? '',
      vistoBueno:vistoBueno,
      simpleUser:simpleUser
    };
    console.log('new',newRes);
    var dir = `${__dirname}/../../../../uploads/cites/plantillas/${res.idTipo.nombreTipo}.docx`;
    const data = fs.readFileSync(dir, "binary");
    const zip = new PizZip(data);
    const doc = new Docxtemplater(zip);
    doc.setData(newRes);
    console.log(dir);
    //Intentar reemplazar los datos
    try {
      doc.render();
    } catch (error) {
      console.error("Error al reemplazar los datos:", error);
    }

    // Exportar el documento modificado a un nuevo archivo
    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // Guardar el archivo con los cambios
    fs.writeFileSync(
      `${__dirname}/../../../../uploads/cites/${res.idTipo.nombreTipo}/${res.fileName}.docx`,
      buf
    );
    const pathFile = path.join(
      __dirname,
      `/../../../../uploads/cites/${res.idTipo.nombreTipo}/${res.fileName}.docx`
    );
    response.sendFile( pathFile);
  }
  public async searchCorrespondencia(request: Request, response: Response) {
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    var searchString = request.params.search;
    let res = await Correspondencia.searchCorrespondencia(searchString);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  public async removeCorrespondencia(request: Request, response: Response) {
    const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = "";
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    var Conta: BussDependencia = new BussDependencia();
    let id: string = request.params.id;
    let res: any = await Correspondencia.readCorrespondencia(id);
    let archivo: any = res.areaContabilidad;
    for (let i = 0; i < archivo.length; i++) {
      let data: any = archivo[i];
      pathViejo = data.path;
      borrarImagen(pathViejo);
      let removeArchivo = await Conta.deleteDependencia(data._id);
    }
    let result = await Correspondencia.deleteCorrespondencia(id);
    response
      .status(200)
      .json({ serverResponse: "Se eliminó la Correspondencia" });
  }
  public async uploadCorrespondencia(request: Request, response: Response) {
    /* const borrarImagen: any = (path: any) => {
      if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
      }
    };
    let pathViejo = ""; */
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    var id: string = request.params.id;
    var CorrespondenciaToUpdate: ICorrespondencia =
      await Correspondencia.readCorrespondencia(id);
    if (!CorrespondenciaToUpdate) {
      response
        .status(300)
        .json({ serverResponse: "Correspondencia no existe!" });
      return;
    }
    if (isEmpty(request.files) && id) {
      var filData: any = request.body;
      var Result = await Correspondencia.updateCorrespondencia(id, filData);
      response
        .status(200)
        .json({ serverResponse: "Correspondencia modificado" });
      return;
    }
    if (isEmpty(request.files)) {
      var filData: any = request.body;
      //var Correspondencia: ICorrespondencia = await Correspondencia.addCorrespondencia(filData);
      response.status(300).json({ serverResponse: Correspondencia });
      return;
    }
    var dir = `${__dirname}/../../../../uploads/archivos`;
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
        var newname: string = `${"GAMB"}_${filData.area}_${
          filData.gestion
        }.${extensionArchivo}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        filData.archivo = newname;
        filData.uri = "getArchivo/" + newname;
        filData.path = totalpath;
        var sliderResult: ICorrespondencia =
          await Correspondencia.addCorrespondencia(filData);
      }
      response.status(200).json({
        serverResponse: sliderResult,
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
      var extensionesValidas = ["pdf"];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return response.status(400).json({
          ok: false,
          msg: "No es una extensión permitida",
        });
      }
      var newname: string = `${"GAMB"}_${filData.area}_${
        filData.gestion
      }.${extensionArchivo}`;
      var totalpath = `${absolutepath}/${newname}`;
      await copyDirectory(totalpath, file);
      filData.archivo = newname;
      /* pathViejo = CorrespondenciaToUpdate.path;
      filData.path = totalpath;
      if(totalpath!=CorrespondenciaToUpdate.path){
        borrarImagen(pathViejo);
      } */
      filData.uri = "getArchivo/" + newname;
      var Result = await Correspondencia.updateCorrespondencia(id, filData);
      response
        .status(200)
        .json({ serverResponse: "Correspondencia modificado" });
      return;
    }
    /* pathViejo = filData.path;
    borrarImagen(pathViejo); */
    response.status(200).json({ serverResponse: "Ocurrio un error" });
    return;
  }
  // public async getFileArchivo(request: Request, response: Response) {
  //   var uri: string = request.params.name;
  //   if (!uri) {
  //     response
  //       .status(300)
  //       .json({ serverResponse: "Identificador no encontrado" });
  //     return;
  //   }
  //   var Conta: BussDependencia = new BussDependencia();
  //   var ArchivoData: IDependemcias = await Conta.getFile(uri);
  //   if (!ArchivoData) {
  //     const pathImg = path.join(
  //       __dirname,
  //       `/../../../../uploads/no-hay-archivo.png`
  //     );
  //     response.sendFile(pathImg);
  //     return;
  //   }
  //   response.sendFile(ArchivoData.path);
  // }
  public async updateCorrespondencia(request: Request, response: Response) {
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Correspondencia.updateCorrespondencia(id, params);
    response.status(200).json({ res: "se editó" });
  }
  // public async addArea(request: Request, response: Response) {
  //   const borrarImagen: any = (path: any) => {
  //     if (fs.existsSync(path)) {
  //       // borrar la imagen anterior
  //       fs.unlinkSync(path);
  //     }
  //   };
  //   let pathViejo = "";
  //   let idCorrespondencia: string = request.params.id;
  //   var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
  //   let conta: BussDependencia = new BussDependencia();
  //   if (idCorrespondencia == null) {
  //     response.status(300).json({ serverResponse: "El id es necesario" });
  //     return;
  //   }
  //   let CorrespondenciaResult = await Correspondencia.readCorrespondencia(idCorrespondencia);
  //   let area = CorrespondenciaResult.area;
  //   var contaData: any = request.body;
  //   //contaData.idCorrespondencia = idCorrespondencia;
  //   if (contaData.fojas == "") {
  //     contaData.fojas = 0;
  //   }
  //   let result: any = {};
  //   let result1: any = {};
  //   if (isEmpty(request.files)) {
  //     if (area === "Contabilidad") {
  //       var resultArea: any = await conta.addDependencia(contaData);
  //       let idArea = resultArea._id;
  //       if (contaData.Correspondencias) {
  //         let partes: any = contaData.Correspondencias.split(",");
  //         let cantCarp = partes.length;
  //         for (let i = 0; i < cantCarp; i++) {
  //           let idArch = partes[i];
  //           let datos: any = { idCorrespondencia: idArch };
  //           var editCorrespondencia = await conta.updatePushConta(idArea, datos);
  //           result = await Correspondencia.addContaId(idArch, idArea);
  //         }
  //         response.status(201).json({
  //           serverResponse: `${"Se agregó a "}${
  //             contaData.Correspondencias.length
  //           }${" Correspondencias el archivo"}`,
  //         });
  //         return;
  //       } else {
  //         let datos: any = { idCorrespondencia: idCorrespondencia };
  //         var editCorrespondencia = await conta.updatePushConta(idArea, datos);
  //         result = await Correspondencia.addContaId(idCorrespondencia, idArea);
  //         response.status(201).json({ serverResponse: result });
  //         return;
  //       }
  //     }
  //   }
  //   //SUBIR Archivo
  //   var dir = `${__dirname}/../../../../uploads/archivos`;
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
  //   //para area de contabilidad con file
  //   if (area === "Contabilidad") {
  //     for (var i = 0; i < key.length; i++) {
  //       var file: any = files[key[i]];
  //       var filehash: string = sha1(new Date().toString()).substr(0, 5);
  //       var nombreCortado = file.name.split(".");
  //       var extensionArchivo = nombreCortado[nombreCortado.length - 1];
  //       // Validar extension
  //       var extensionesValidas = ["pdf"];
  //       if (!extensionesValidas.includes(extensionArchivo)) {
  //         return response.status(400).json({
  //           ok: false,
  //           msg: "No es una extensión permitida",
  //         });
  //       }
  //       var newname: string = `${"GAMB"}_${filehash}_${area}_${
  //         CorrespondenciaResult.tipo
  //       }_${"Nro"}${contaData.numero}_${
  //         CorrespondenciaResult.gestion
  //       }.${extensionArchivo}`;
  //       var totalpath = `${absolutepath}/${newname}`;
  //       await copyDirectory(totalpath, file);
  //       contaData.nameFile = newname;
  //       contaData.uri = "getArchivos/" + newname;
  //       contaData.path = totalpath;
  //       var resultArea = await conta.addDependencia(contaData);
  //     }
  //     let idArea = resultArea._id;
  //     //si existe Correspondencias
  //     if (contaData.Correspondencias) {
  //       let partes: any = contaData.Correspondencias.split(",");
  //       let cantCarp = partes.length;
  //       for (let i = 0; i < cantCarp; i++) {
  //         let idArch = partes[i];
  //         let datos: any = { idCorrespondencia: idArch };
  //         var editCorrespondencia = await conta.updatePushConta(idArea, datos);
  //         result = await Correspondencia.addContaId(idArch, idArea);
  //       }
  //       response.status(201).json({
  //         serverResponse: `${"Se agregó a "}${
  //           contaData.Correspondencias.length
  //         }${" Correspondencias el archivo con file"}`,
  //       });
  //       return;
  //       //si no existe Correspondencias
  //     } else {
  //       let datos: any = { idCorrespondencia: idCorrespondencia };
  //       var editCorrespondencia = await conta.updatePushConta(idArea, datos);
  //       result = await Correspondencia.addContaId(idCorrespondencia, idArea);
  //       response.status(201).json({ serverResponse: result });
  //       return;
  //     }
  //   }
  //   if (area === "Juridica") {
  //     /* result1 = await conta.addConta(contaData);
  //     let idArea = result1._id;
  //     result = await Correspondencia.addContaId(idCorrespondencia, idArea); */
  //   }
  //   if (resultArea == null) {
  //     response.status(300).json({ serverResponse: "no se pudo guardar" });
  //     return;
  //   }
  //   //response.status(200).json({ serverResponse: resultArea });
  // }
  public async addArchivo(request: Request, response: Response) {
    let idCorrespondencia: string = request.params.id;
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    let Conta: BussDependencia = new BussDependencia();
    let idArchivo = request.body.archivo;
    let CorrespondenciaResult: any = await Correspondencia.readCorrespondencia(
      idCorrespondencia
    );
    if (!CorrespondenciaResult) {
      response
        .status(300)
        .json({ serverResponse: "Correspondencia no existe!" });
      return;
    }
    let area = CorrespondenciaResult.area;
    if (area === "Contabilidad") {
      var resultArea = await Conta.readDependencias(idArchivo);
      if (resultArea != null) {
        var checksub: any = CorrespondenciaResult.areaContabilidad.filter(
          (item: any) => {
            if (resultArea._id.toString() == item._id.toString()) {
              return true;
            }
            return false;
          }
        );
        if (checksub.length == 0) {
          let datos: any = { idCorrespondencia: idCorrespondencia };
          var editCorrespondencia = await Conta.updatePushConta(
            idArchivo,
            datos
          );
          var result = await Correspondencia.addContaId(
            idCorrespondencia,
            idArchivo
          );
          response.status(200).json({ serverResponse: resultArea });
          return;
        }
        response.status(300).json({
          serverResponse: "Ya existe el ARCHIVO en esta Correspondencia",
        });
        return;
      }
    }
  }
  public async removeArchivo(request: Request, response: Response) {
    let idCorrespondencia: string = request.params.id;
    var Correspondencia: BussCorrespondencia = new BussCorrespondencia();
    let Conta: BussDependencia = new BussDependencia();
    let idArchivo = request.body.idArchivo;
    let CorrespondenciaResult: any = await Correspondencia.readCorrespondencia(
      idCorrespondencia
    );
    if (!CorrespondenciaResult) {
      response
        .status(300)
        .json({ serverResponse: "Correspondencia no existe!" });
      return;
    }
    let area = CorrespondenciaResult.area;
    if (area === "Contabilidad") {
      var resultArea = await Conta.readDependencias(idArchivo);
      if (resultArea != null) {
        var checksub: any = CorrespondenciaResult.areaContabilidad.filter(
          (item: any) => {
            if (resultArea._id.toString() == item._id.toString()) {
              return true;
            }
            return false;
          }
        );
        if (checksub.length != 0) {
          let datos: any = { idCorrespondencia: idCorrespondencia };
          var editCorrespondencia = await Conta.updateContaId(idArchivo, datos);
          var result = await Correspondencia.removeContaId(
            idCorrespondencia,
            idArchivo
          );
          response.status(200).json({ serverResponse: "Se movió el archivo" });
          return;
        }
        response.status(300).json({
          serverResponse: "Ya no existe el ARCHIVO en esta Correspondencia",
        });
        return;
      }
    }
  }
  public async queryContaAll(request: Request, response: Response) {
    var Conta: BussDependencia = new BussDependencia();
    var filter1: any = {};
    var filter2: any = {};
    var params: any = request.query;
    if (params.area != null) {
      var area = new RegExp(params.area, "i");
      filter1["area"] = area;
    }
    if (params.tipo != null) {
      var tipo = new RegExp(params.tipo, "i");
      filter1["tipo"] = tipo;
    }
    if (params.subTipo != null) {
      var subTipo = new RegExp(params.subTipo, "i");
      filter1["subTipo"] = subTipo;
    }
    if (params.gestion != null) {
      var gestion: number = parseInt(params.gestion);
      if (Number.isNaN(gestion)) {
        filter1["gestion"];
      } else {
        filter1["gestion"] = gestion;
      }
    }
    if (params.glosa != null) {
      var glosa = new RegExp(params.glosa, "i");
      filter2["glosa"] = glosa;
    }
    if (params.beneficiario != null) {
      var beneficiario = new RegExp(params.beneficiario, "i");
      filter2["beneficiario"] = beneficiario;
    }
    if (params.numero != null) {
      var numero = new RegExp(params.numero, "i");
      filter2["numero"] = numero;
    }
    if (params.ci != null) {
      var ci = new RegExp(params.ci, "i");
      filter2["ci"] = ci;
    }
    let res = await Conta.queryContaAll(filter1, filter2);
    response.status(200).json({ serverResponse: res, total: res.length });
  }
  //----------DEPENDENCIA------------//
  public async createDependencia(request: Request, response: Response) {
    var Dependencia: BussDependencia = new BussDependencia();
    var DependenciaData = request.body;
    let result = await Dependencia.addDependencia(DependenciaData);
    response.status(201).json({ serverResponse: result });
  }
  public async getDependencias(request: Request, response: Response) {
    var dependencia: BussDependencia = new BussDependencia();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.glosa != null) {
      var glosa = new RegExp(params.glosa, "i");
      filter["glosa"] = glosa;
    }
    if (params.beneficiario != null) {
      var beneficiario = new RegExp(params.beneficiario, "i");
      filter["beneficiario"] = beneficiario;
    }
    if (params.numero != null) {
      var numero = new RegExp(params.numero, "i");
      filter["numero"] = numero;
    }
    if (params.fojas != null) {
      var fojas = new RegExp(params.fojas, "i");
      filter["fojas"] = fojas;
    }
    if (params.ci != null) {
      var ci = new RegExp(params.ci, "i");
      filter["ci"] = ci;
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
    let respost: Array<IDependemcias> = await dependencia.readDependencias();
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
    let res: Array<IDependemcias> = await dependencia.readDependencias(
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
  public async getDependencia(request: Request, response: Response) {
    var dependencia: BussDependencia = new BussDependencia();
    let repres = await dependencia.readDependencias(request.params.id);
    response.status(200).json(repres);
  }
  //Archivos de conta sin asociar a una Correspondencia
  public async getContaSin(request: Request, response: Response) {
    var Conta: BussDependencia = new BussDependencia();
    let data: any = { idCorrespondencia: { $size: 0 } };
    let repres = await Conta.getContaSin(data);
    response.status(200).json(repres);
  }
  public async updateDependencia(request: Request, response: Response) {
    var Dependencia: BussDependencia = new BussDependencia();
    let id: string = request.params.id;
    var params = request.body;
    var result: any = await Dependencia.readDependencias(id);
    if (!result) {
      response.status(300).json({ serverResponse: "Dependencia no existe" });
      return;
    }
    var Result = await Dependencia.updateDependencia(id, params);
    response.status(200).json({ serverResponse: "Dependencia modificado" });
    return;
  }
  public async removeDependencia(request: Request, response: Response) {
    var Dependencia: BussDependencia = new BussDependencia();
    let id: string = request.params.id;
    var res: any = await Dependencia.readDependencias(id);
    if (!res) {
      response.status(300).json({ serverResponse: "Dependencia no existe" });
      return;
    }
    let result = await Dependencia.deleteDependencia(id);
    response.status(200).json({ serverResponse: "Se elimino la Dependencia" });
  }
  // public async searchConta(request: Request, response: Response) {
  //   var Conta: BussDependencia = new BussDependencia();
  //   var searchConta = request.params.search;
  //   let res = await Conta.searchConta(searchConta);
  //   response.status(200).json({ serverResponse: res });
  // }
  // ----------SUBTIPO------------
  public async createSubTipo(request: Request, response: Response) {
    var SubTipo: BussSubTipo = new BussSubTipo();
    var SubTipoData = request.body;
    let result = await SubTipo.addSubTipo(SubTipoData);
    response.status(201).json({ serverResponse: result });
  }
  public async getSubTipos(request: Request, response: Response) {
    var SubTipo: BussSubTipo = new BussSubTipo();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.detalle != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter["nombre"] = nombre;
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
    let resp: number = await SubTipo.total({});
    var totalDocs = resp;
    var totalpage = Math.ceil(resp / limit);
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
    let res: Array<ISubTipo> = await SubTipo.readSubTipo(
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
  public async getSubTipo(request: Request, response: Response) {
    var SubTipo: BussSubTipo = new BussSubTipo();
    let result = await SubTipo.readSubTipo(request.params.id);
    response.status(200).json(result);
  }
  public async updateSubTipo(request: Request, response: Response) {
    var SubTipo: BussSubTipo = new BussSubTipo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await SubTipo.updateSubTipo(id, params);
    response.status(200).json(result);
  }
  // public async addTipo(request: Request, response: Response) {
  //   var SubTipo: BussSubTipo = new BussSubTipo();
  //   let id: string = request.params.id;
  //   var params = request.body;
  //   var result = await SubTipo.addTipo(id, params);
  //   response.status(200).json(result);
  // }
  // public async removeTipo(request: Request, response: Response) {
  //   var SubTipo: BussSubTipo = new BussSubTipo();
  //   let id: string = request.params.id;
  //   var params = request.body;
  //   var result = await SubTipo.removeTipo(id, params);
  //   response.status(200).json(result);
  // }
  public async removeSubTipo(request: Request, response: Response) {
    var SubTipo: BussSubTipo = new BussSubTipo();
    let id: string = request.params.id;
    let result = await SubTipo.deleteSubTipo(id);
    response.status(200).json({ serverResponse: "Se elimino SubTipo" });
  }
  // ----------TIPO------------
  public async createTipo(request: Request, response: Response) {
    var Tipo: BussTipo = new BussTipo();
    var TipoData = request.body;
    let result = await Tipo.addTipo(TipoData);
    response.status(201).json({ serverResponse: result });
  }
  public async getTipos(request: Request, response: Response) {
    var Tipo: BussTipo = new BussTipo();
    var filter: any = {};
    var params: any = request.query;
    var limit = 0;
    var skip = 0;
    var aux: any = {};
    var order: any = {};
    if (params.detalle != null) {
      var nombre = new RegExp(params.nombre, "i");
      filter["nombre"] = nombre;
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
    let resp: number = await Tipo.total({});
    var totalDocs = resp;
    var totalpage = Math.ceil(resp / limit);
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
    let res: Array<ITipo> = await Tipo.readTipo(filter, skip, limit, order);
    response.status(200).json({
      serverResponse: res,
      totalDocs,
      limit,
      totalpage,
      skip,
    });
    return;
  }
  public async getTipo(request: Request, response: Response) {
    var Tipo: BussTipo = new BussTipo();
    let result = await Tipo.readTipo(request.params.id);
    response.status(200).json(result);
  }
  public async updateTipo(request: Request, response: Response) {
    var Tipo: BussTipo = new BussTipo();
    let id: string = request.params.id;
    var params = request.body;
    var result = await Tipo.updateTipo(id, params);
    response.status(200).json(result);
  }
  public async addSubTipo(request: Request, response: Response) {
    const Tipo: BussTipo = new BussTipo();
    const SubTipo: BussSubTipo = new BussSubTipo();
    let id: string = request.params.id;
    const SubTipoData = request.body;
    SubTipoData.idTipo = id;
    let result: any = await SubTipo.addSubTipo(SubTipoData);
    let datos: any = { idSubTipos: result._id };
    const resultAdd = await Tipo.addIdSubTipo(id, datos);
    response.status(200).json(result);
  }
  // public async removeTipo(request: Request, response: Response) {
  //   var Tipo: BussTipo = new BussTipo();
  //   let id: string = request.params.id;
  //   var params = request.body;
  //   var result = await Tipo.removeTipo(id, params);
  //   response.status(200).json(result);
  // }
  public async removeTipo(request: Request, response: Response) {
    var Tipo: BussTipo = new BussTipo();
    let id: string = request.params.id;
    let result = await Tipo.deleteTipo(id);
    response.status(200).json({ serverResponse: "Se elimino Tipo" });
  }
}
export default RoutesController;
