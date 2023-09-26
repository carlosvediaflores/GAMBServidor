import mongoose, { Schema, Document, Number } from "mongoose";
/* import compraModel, { ICompra } from "../models/compras";
import egresopModel, { IEgreso } from "../models/egreso"; */

export interface IAreaContabilida extends Document {
  numero: string;
  glosa: string;
  beneficiario: string;
  fecha: Date;
  monto: number;
  fojas: number;
  ci:string;
  observacion: string;
  uri: string;
  path: string;
  nameFile:string;
  idCarpeta: string;
}
const areaSchema: Schema = new Schema(
  {
    numero: { type: String },
    glosa: { type: String },
    beneficiario: { type: String },
    fecha: { type: Date },
    monto: { type: Number },
    fojas: { type: Number },
    ci:{type:String},
    observacion: { type: String },
    uri: { type: String },
    path: { type: String },
    nameFile:{type:String},
    idCarpeta: [{ type: Schema.Types.ObjectId, ref: "arch_carpetas" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IAreaContabilida>("arch_contabilidades", areaSchema);
