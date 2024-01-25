import FileModel, { IFiles } from "./../models/Files";
import { query } from "express";
import HojaModel, { IHojaruta } from "./../models/Hojaruta";
import SeguientoModel, { ISeguimiento } from "./../models/Seguimiento";
class BusinessHoja {
  public async readHoja(): Promise<Array<IHojaruta>>;
  public async readHoja(id: string): Promise<IHojaruta>;
  public async readHoja(nuit: string): Promise<IHojaruta>;
  public async readHoja(
    query?: any,
    limit?: number,
    skip?: number
  ): Promise<Array<IHojaruta>>;
  public async readHoja(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IHojaruta> | IHojaruta> {
    if (params1 && typeof params1 == "string") {
      var result: IHojaruta = await HojaModel.findOne({ _id: params1 })
        .populate({
          path: "seguimiento",
          model: "seguimiento",
          populate: { path: "archivofi", model: "hrarchivo" },
        })
        .populate({
          path: "asociados",
          model: "Hojaruta",
          populate: { path: "seguimiento", model: "seguimiento" },
        });
      return result;
    } else if (params1) {
      let skip = params3;
      let limit = params2;
      let result: Array<IHojaruta> = await HojaModel.find({})
        .limit(limit)
        .skip(skip)
        .sort({ fecharesepcion: -1 });
      return result;
    } else {
      let listHoja: Array<IHojaruta> = await HojaModel.find().sort({ _id: -1 });
      return listHoja;
    }
  }
  public async readHojaRuta(): Promise<Array<IHojaruta>>;
  public async readHojaRuta(id: string): Promise<IHojaruta>;
  public async readHojaRuta(
    query: any,
    skip?: number,
    limit?: number,
    order?: any
  ): Promise<Array<IHojaruta>>;

  public async readHojaRuta(
    params1?: string | any,
    params2?: number,
    params3?: number,
    order?: any
  ): Promise<Array<IHojaruta> | IHojaruta> {
    let skip = params2;
    let limit = params3;
    let listSegui = await HojaModel.find(params1)
      .skip(skip)
      .limit(limit)
      .sort(order)
      .populate({
        path: "seguimiento",
        model: "seguimiento",
        populate: { path: "archivofi", model: "hrarchivo" },
      })
      .populate({
        path: "asociados",
        model: "Hojaruta",
        populate: { path: "seguimiento", model: "seguimiento" },
      });
    return listSegui;
  }
  /* public async total({}) {
    var result = await HojaModel.countDocuments();
    return result;
  } */
  public async total(query: any): Promise<any>;

  public async total(params1?: string | any) {
    let listSegui = await HojaModel.countDocuments(params1);
    return listSegui;
  }
  public async getNuit() {
    var result = await HojaModel.find().limit(1).sort({ _id: -1 });
    return result;
  }
  public async getNuitOne(nuit: string) {
    var result = await HojaModel.findOne({ nuit: nuit })
      .populate({
        path: "seguimiento",
        model: "seguimiento",
        populate: { path: "archivofi", model: "hrarchivo" },
      })
      .populate({
        path: "asociados",
        model: "Hojaruta",
        populate: { path: "seguimiento", model: "seguimiento" },
      });
    return result;
  }
  public async asodHoja(nuit: string): Promise<IHojaruta>;
  public async asodHoja(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IHojaruta> | IHojaruta> {
    if (params1 && typeof params1 == "string") {
      var result: IHojaruta = await HojaModel.findOne({ nuit: params1 })
        .populate({
          path: "seguimiento",
          model: "seguimiento",
          populate: { path: "archivofi", model: "hrarchivo" },
        })
        .populate({
          path: "asociados",
          model: "Hojaruta",
          populate: { path: "seguimiento", model: "seguimiento" },
        });
      return result;
    } else if (params1 && typeof params1 == "string") {
      var result: IHojaruta = await HojaModel.findOne({ nuit: params1 });
      return result;
    } else {
      let listHoja: Array<IHojaruta> = await HojaModel.find().sort({ _id: -1 });
      return listHoja;
    }
  }
  public async search(query?: any): Promise<Array<IHojaruta>>;
  public async search(
    search: string | any,
    params2?: number,
    params3?: number
  ) {
    var filter = {
      $or: [
        { nuit: { $regex: search, $options: "i" } },
        { origen: { $regex: search, $options: "i" } },
        { referencia: { $regex: search, $options: "i" } },

        //Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
      ],
    };
    let skip = params2 ? params2 : 0;
    let limit = params3 ? params3 : 500;
    let listHoja: Array<IHojaruta> = await HojaModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    return listHoja;
  }
  public async addHoja(hoja: IHojaruta) {
    try {
      let userDb = new HojaModel(hoja);
      let result = await userDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  public async addSeguim(idRuta: string, idSegui: string) {
    let ruta = await HojaModel.findOne({ _id: idRuta });
    if (ruta != null) {
      var segui = await SeguientoModel.findOne({ _id: idSegui });
      if (segui != null) {
        var checksub: Array<ISeguimiento> = ruta.seguimiento.filter((item) => {
          if (segui._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checksub.length == 0) {
          ruta.seguimiento.push(segui);
          return await ruta.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async asociarHoja(NH: string, NA: string) {
    let hoja = await HojaModel.findOne({ nuit: NH });
    if (hoja != null) {
      var aso = await HojaModel.findOne({ nuit: NA });
      if (aso != null) {
        var checkrol: Array<IHojaruta> = hoja.asociado.filter((item) => {
          if (aso.nuit.toString() == item.nuit.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          hoja.asociado.push(aso);
          return await aso.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }

  public async asociarHR(NH: string, NA: string) {
    let hoja = await HojaModel.findOne({ nuit: NH });
    if (hoja != null) {
      var aso = await HojaModel.findOne({ nuit: NA });
      if (aso != null) {
        var checkrol: Array<IHojaruta> = hoja.asociado.filter((item) => {
          if (aso.nuit.toString() == item.nuit.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          hoja.asociado.push(aso);
          return await aso.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }

  public async asociarHojaA(NH: string, NA: any) {
    let hoja = await HojaModel.findOne({ nuit: NH });
    if (hoja != null) {
      var aso: IHojaruta = await HojaModel.findOne({ nuit: NA });
      var result1: any = {
        _id: aso._id,
        nuit: aso.nuit,
        origen: aso.origen,
        referencia: aso.referencia,
        fechadocumento: aso.fechadocumento,
        fecharesepcion: aso.fecharesepcion,
        estado: aso.estado,
      };
      if (aso != null) {
        hoja.asociado.push(result1);
        return await hoja.save();
        aso.save();
      }
      return null;
      console.log({ res: "ni se pudo suardar" });
    }
    return null;
  }
  public async asociarHojaB(NH: string, NA: any) {
    let aso = await HojaModel.findOne({ nuit: NA });
    if (aso != null) {
      var hoja: IHojaruta = await HojaModel.findOne({ nuit: NH });
      var result2: any = {
        _id: hoja._id,
        nuit: hoja.nuit,
        origen: hoja.origen,
        referencia: hoja.referencia,
        fechadocumento: hoja.fechadocumento,
        fecharesepcion: hoja.fecharesepcion,
        estado: hoja.estado,
      };
      if (hoja != null) {
        aso.asociado.push(result2);
        return await aso.save();
        aso.save();
      }
      return null;
    }
    return null;
  }

  public async updateHojas(id: string, hoja: any) {
    let result = await HojaModel.updateOne({ _id: id }, { $set: hoja });
    return result;
  }
  public async deleteHojas(id: string) {
    let result = await HojaModel.remove({ _id: id });
    return result;
  }
  public async addFiles(idruta: string, idFile: string) {
    let ruta = await HojaModel.findOne({ _id: idruta });
    if (ruta != null) {
      var fil = await FileModel.findOne({ _id: idFile });
      if (fil != null) {
        var checkrol: Array<IFiles> = ruta.archivo.filter((item) => {
          if (fil._id.toString() == item._id.toString()) {
            return true;
          }
          return false;
        });
        if (checkrol.length == 0) {
          ruta.archivo.push(fil);
          return await ruta.save();
        }
        return null;
      }
      return null;
    }
    return null;
  }
  public async addIdHR(idHRA: string, idHRB: any) {
    let result = await HojaModel.updateOne(
      { _id: idHRA },
      { $push: { asociados: idHRB } }
    );
    return result;
  }
  public async removeIdHR(idOr: string, organizacion: any) {
    let result = await HojaModel.updateOne(
      { _id: idOr },
      { $pull: organizacion }
    );
    return result;
  }
}
export default BusinessHoja;
