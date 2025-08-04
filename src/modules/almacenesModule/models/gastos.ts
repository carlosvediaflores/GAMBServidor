import mongoose, { Schema, Document, Number, Types } from "mongoose";
import proveedores from "./proveedores";
import facturas from "./facturas";
export interface Igastos extends Document {
  fechaRegistro?: string;
  gestion: number;
  montoGasto: number;
  tipoFondo: string; // fondo rotatatorio, en avance
  tipoGasto: string; // Combustible, mantenimiento, electricidad
  fuente: string;
  partida: string;
  estado: string;
  catProgra: string;
  solicitante: string;
  numDesembolso: string;
  idSolicitante: string;
  idPartida: string;
  idFuente: string;
  idCartProgra: string;
  idDesemFondo: string;
  idDesembolso: string;
  idTipoGasto: string;
  idCombustible: string;
  idEnergiaElectrica: string;
  idViaticos: string;
  idPasajes: string;
  idRepuestos: string;
  idMantenimiento: string;
  idUserRegister: string;
  idTipoDesembolso: string;
  nameCatProg: string;
  isReposicion: boolean;
  idVehiculo?: string;
  descripcion?: string;
  proveedor?: string;
  facturas?: string[];
}
const gastoSchema: Schema = new Schema(
  {
    fechaRegistro: { type: Date, default: new Date() },
    gestion: { type: Number },
    montoGasto: { type: Number },
    tipoFondo: { type: String },
    tipoGasto: { type: String },
    fuente: { type: String },
    partida: { type: String },
    estado: { type: String, default: "PENDIENTE" },
    catProgra: { type: String },
    nameCatProg: { type: String },
    solicitante: { type: String },
    numDesembolso: { type: String },
    isReposicion: { type: Boolean, default: false },
    idSolicitante: { type: Schema.Types.ObjectId, ref: "User" },
    idPartida: { type: Schema.Types.ObjectId, ref: "partidas" },
    idFuente: { type: Schema.Types.ObjectId, ref: "alm_fuente" },
    idCartProgra: { type: Schema.Types.ObjectId, ref: "alm_SegPoas" },
    idDesemFondo: { type: Schema.Types.ObjectId, ref: "alm_desemFuente" },
    idDesembolso: { type: Schema.Types.ObjectId, ref: "alm_desembolso" },
    idTipoGasto: { type: Schema.Types.ObjectId, ref: "alm_gastoFondo" },
    idTipoDesembolso: { type: Schema.Types.ObjectId, ref: "alm_tipoDesembolso" },
    idCombustible: { type: Schema.Types.ObjectId, ref: "alm_vale" },
    idEnergiaElectrica: { type: Schema.Types.ObjectId, ref: "alm_vale" },
    idViaticos: { type: Schema.Types.ObjectId, ref: "alm_vale" },
    idVehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
    idUserRegister: { type: Schema.Types.ObjectId, ref: "User" },
    descripcion: { type: String },
    proveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    facturas: [{ type: Schema.Types.ObjectId, ref: "alm_facturas" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<Igastos>("alm_gasto", gastoSchema);
