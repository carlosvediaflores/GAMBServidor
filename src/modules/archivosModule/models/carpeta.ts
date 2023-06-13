import mongoose, { Schema, Document, Number } from "mongoose";
import compraModel, { IAreaContabilida } from "../models/contabilidad";
//import egresopModel, { IEgreso } from "../models/egreso";

export interface ICarpeta extends Document {
  gestion: string;
  objetivo: string;
  concepto: string;
  tomo: string;
  fecha: Date;
  numero: number;
  tipo: string;
  lugar: string;
  ubicacion: string;
  archivo: string;
  uri: string;
  path: string;
  area: string;
  idArchivoArea: [];
  idUsuario: string;
}
const carpetaSchema: Schema = new Schema(
  {
    gestion: { type: String },
    objeto: { type: String },
    concepto: { type: String },
    tomo: { type: String },
    fecha: { type: String },
    numero: { type: Number },
    tipo: { type: String },
    lugar: { type: String },
    ubicacion: { type: String },
    archivo: { type: String },
    uri: { type: String },
    path: { type: String },
    area:{type:Object},
    areaContabilidad: [{ type: Schema.Types.ObjectId, ref: compraModel}],
    areaContrataciones: [{ type: Schema.Types.ObjectId, ref: 'arch_contrataciones'}],
    areaJuridica: [{ type: Schema.Types.ObjectId, ref: 'arch_juridicas'}],
    areaRecaudaciones: [{ type: Schema.Types.ObjectId, ref: 'arch_recaudaciones'}],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICarpeta>("arch_carpetas", carpetaSchema);
