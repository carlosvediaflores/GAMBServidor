import mongoose, { Schema, Document, Number } from "mongoose";
import compraModel, { ICompra } from "../models/compras";
export interface ISimpleIngreso {
  productos?: Array<ICompra>;
  concepto?: string;
  fecha?: number;
  numeroEntrada?:number;
  estado?: string;
  idPersona?: string;
  idProveedor?: string;
  idUsuario?: string;
}
export interface IIngreso extends Document {
  productos: Array<ICompra>;
  concepto: string;
  fecha: number;
  numeroEntrada:number;
  estado: string;
  idPersona: string;
  idProveedor: string;
  idUsuario: string;
}
const ingresoSchema: Schema = new Schema(
  {
    productos: [{ type: Schema.Types.ObjectId, ref: "alm_compras"}],
    concepto: { type: String },
    fecha: { type: Date, default:new Date},
    numeroEntrada: { type: Number, default:1},
    estado: {type: String, default:"REGISTRADO"},
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IIngreso>("alm_ingresos", ingresoSchema);
