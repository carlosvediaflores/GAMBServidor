import mongoose, { Schema, Document, Number } from "mongoose";
/* import compraModel, { ICompra } from "../models/compras";
import egresopModel, { IEgreso } from "../models/egreso"; */

export interface IDependemcias extends Document {
  descripcion: string;
  sigla: string;
  isActive:boolean;
  idDependencia: string;
}
const areaSchema: Schema = new Schema(
  {
    descripcion: { type: String },
    sigla: { type: String, unique: true },
    isActive:{type:Boolean, default:true},
    idDependencia: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IDependemcias>("corr_dependencias", areaSchema);
