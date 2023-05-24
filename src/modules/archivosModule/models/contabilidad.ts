import mongoose, { Schema, Document, Number } from "mongoose";
/* import compraModel, { ICompra } from "../models/compras";
import egresopModel, { IEgreso } from "../models/egreso"; */

export interface IAreaContabilida extends Document {
  numero: number;
  detalle: string;
  beneficiario: string;
  fecha: Date;
  monto: number;
  fojas: number;
  observacion: string;
  idCarpeta: string;
}
const areaSchema: Schema = new Schema(
  {
    numero: { type: Number },
    detalle: { type: String },
    beneficiario: { type: String },
    fecha: { type: Date },
    monto: { type: Number },
    fojas: { type: Number },
    observacion: { type: String },
    idCarpeta: { type: Schema.Types.ObjectId, ref: "arch_carpetas" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IAreaContabilida>("arch_contabilidades", areaSchema);
