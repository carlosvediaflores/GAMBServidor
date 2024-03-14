import mongoose, { Schema, Document } from "mongoose";
import compraModel, { ICompra } from "../models/compras";
import { ISalida } from "./salida";
export interface IEgreso extends Document {
  productos: Array<ISalida>;
  glosaSalida: string;
  entregado:string;
  cargo:string;
  fecha: number;
  numeroSalida:number;
  estadoEgreso: string;
  idProveedor: string;
  idPersona: string;
  idUsuario: string;
  idIngreso: string;
}
const egresoSchema: Schema = new Schema(
  {
    productos: [{ type: Schema.Types.ObjectId, ref: "alm_salidas"}],
    glosaSalida: { type: String },
    entregado: { type: String },
    cargo: { type: String },
    fecha: { type: Date, default:new Date()},
    numeroSalida: { type: Number},
    estadoEgreso: {type: String, default:"REGISTRADO"},
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User", require:false},
    idIngreso: { type: Schema.Types.ObjectId, ref: "alm_ingresos" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEgreso>("alm_egresos", egresoSchema);
