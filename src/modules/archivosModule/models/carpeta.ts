import mongoose, { Schema, Document, Number } from "mongoose";
import contaModel, { IAreaContabilida } from "../models/contabilidad";
import recaudacionesModel, { IAreaRecaudaciones } from "../models/recaudaciones";
//import egresopModel, { IEgreso } from "../models/egreso";

export interface ICarpeta extends Document {
  gestion: string;
  area: string;
  tipo: string;
  subTipo:string;
  numCarpeta: number;
  nameCarpeta: string;
  lugar: string;
  estante: string;
  fila: string;
  idArchivoArea: [];
  idUsuario: string;
}
const carpetaSchema: Schema = new Schema(
  {
    gestion: { type: String },
    area:{type:Object},
    tipo: { type: String },
    subTipo:{type:String},
    numCarpeta: { type: Number },
    nameCarpeta: { type: String },
    lugar: { type: String },
    estante: { type: String },
    fila: { type: String },
    areaContabilidad: [{ type: Schema.Types.ObjectId, ref: "arch_contabilidades"}],
    areaContrataciones: [{ type: Schema.Types.ObjectId, ref: recaudacionesModel}],
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
