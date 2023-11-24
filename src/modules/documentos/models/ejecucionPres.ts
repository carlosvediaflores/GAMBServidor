import mongoose, { Schema, Document, Number } from "mongoose";

export interface IEjecucion extends Document {
  gestion: string;
  nombre: string;
  publico: boolean;
  estado: boolean;
  archivos: [];
  idUsuario: string;
}
const ejecucionSchema: Schema = new Schema(
  {
    gestion: { type: String },
    nombre: { type: String },
    publico: { type: Boolean, default: true },
    estado: { type: Boolean, default: true },
    archivos: [{ type: Schema.Types.ObjectId, ref: "doc_ejecucionfile" }],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEjecucion>("doc_ejecucion", ejecucionSchema);
