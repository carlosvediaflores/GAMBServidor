import mongoose, { Schema, Document, Number } from "mongoose";
/* import compraModel, { ICompra } from "../models/compras";
import egresopModel, { IEgreso } from "../models/egreso"; */

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
  arearea: string;
  idArchivoArea: [];
  idUsuario: string;
}
const carpetaSchema: Schema = new Schema(
  {
    gestion: { type: Number },
    objetivo: { type: String },
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
    //idArea: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
    areaContabilidad: [{ type: Schema.Types.ObjectId, ref: "arch_contabilidades"}],
    areaContrataciones: [{ type: Schema.Types.ObjectId, ref: "arch_contrataciones"}],
    areaJuridica: [{ type: Schema.Types.ObjectId, ref: "arch_juridicas"}],
    areaRecaudaciones: [{ type: Schema.Types.ObjectId, ref: "arch_recaudaciones"}],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICarpeta>("arch_carpetas", carpetaSchema);
