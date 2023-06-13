import mongoose, { Schema, Document, Number } from "mongoose";
import compraModel, { ICompra } from "../models/compras";
import egresopModel, { IEgreso } from "../models/egreso";
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
  fechaContrato: Date;
  plazo:number;
  numeroEntrada:number;
  estado: string;
  tipo:string;
  idPersona: string;
  idProveedor: string;
  idUsuario: string;
  idEgreso: Array<IEgreso>;
}
const ingresoSchema: Schema = new Schema(
  {
    productos: [{ type: Schema.Types.ObjectId, ref: "alm_compras"}],
    concepto: { type: String },
    fecha: { type: Date, default:new Date},
    fechaContrato: { type: Date, default:new Date},
    plazo: { type: Number},
    numeroEntrada: { type: Number, default:1},
    estado: {type: String, default:"REGISTRADO"},
    tipo:{type:String, default:"REGULAR"},
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
    idEgreso: [{ type: Schema.Types.ObjectId, ref: "alm_egresos"}],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IIngreso>("alm_ingresos", ingresoSchema);
