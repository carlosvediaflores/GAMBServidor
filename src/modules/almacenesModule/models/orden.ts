import mongoose, { Schema, Document, Number } from "mongoose";
import gastoFondo from "./gastoFondo";
export interface IOrden extends Document {
  numeroOrden: number;
  fecha: Date;
  fechaEntrada: Date;
  fechaSalida: Date;
  catProgra: string;
  idGasto:[string];
  encargadoControl: string;
  idCompra: string;
  idEgreso: string;
  descripcion: string;
  unidadSolicitante: string;
  conductor: string;
  vehiculo: string;
  precio: number;
  productos: [string];
  servicios: [string];
  tipoServicio: string;
  cantidadAdquirida: number;
  saldoDevolucion: number;
  saldoDevuelto: number;
  estado: string;
  idFacturas: [string];}
const ordenSchema: Schema = new Schema(
  {
    numeroOrden: { type: Number },
    fecha: { type: Date, default: new Date() },
    fechaEntrada: { type: Date, default:new Date()},
    fechaSalida: { type: Date, default:new Date()},
    catProgra: { type: String },
    idGasto:{type: [Schema.Types.ObjectId], ref: "alm_gasto" },
    encargadoControl: { type: Schema.Types.ObjectId, ref: "User" },
    idCompra: { type: Schema.Types.ObjectId, ref: "alm_compras" },
    idEgreso: { type: Schema.Types.ObjectId, ref: "alm_egresos" },
    descripcion: { type: String },
    unidadSolicitante: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
    conductor: { type: Schema.Types.ObjectId, ref: "User" },
    vehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
    productos: { type: Array },
    servicios: { type: Array },
    tipoServicio: { type: String },
    precio: { type: Number, default: 0 },
    estado: { type: String, default: "REGISTRADO" },
    cantidadAdquirida: { type: Number, default: 0 },
    saldoDevolucion: { type: Number, default: 0 },
    saldoDevuelto: { type: Number, default: 0 },
    idFacturas: [{ type: Schema.Types.ObjectId, ref: "alm_factura"}],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IOrden>("alm_orden", ordenSchema);
