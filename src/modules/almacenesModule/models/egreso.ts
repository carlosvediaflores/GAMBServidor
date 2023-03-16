import mongoose, { Schema, Document } from "mongoose";
import compraModel, { ICompra } from "../models/compras";
import { ISalida } from "./salida";
export interface IEgreso extends Document {
  productos: Array<ISalida>;
  concepto: string;
  fecha: number;
  numeroEgreso:number;
  estadoEgreso: string;
  idProveedor: string;
  idPersona: string;
  idUsuario: string;
  idIngreso: string;
}
const egresoSchema: Schema = new Schema(
  {
    productos: [{ type: Schema.Types.ObjectId, ref: "alm_salidas"}],
    concepto: { type: String },
    fecha: { type: Date, default:new Date},
    numeroSalida: { type: Number},
    estadoEgreso: {type: String, default:"REGISTRADO"},
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User" },
    idIngreso: { type: Schema.Types.ObjectId, ref: "alm_ingresos" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEgreso>("alm_egresos", egresoSchema);
