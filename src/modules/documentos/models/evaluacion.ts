import mongoose, { Schema, Document, Number } from "mongoose";

export interface IEvaluacion extends Document {
  gestion: string;
  mes: string;
  titulo: string;
  publico: boolean;
  estado: boolean;
  archivos: [];
  idUsuario: string;
}
const evaluacionSchema: Schema = new Schema(
  {
    gestion: { type: String },
    mes: { type: String },
    titulo: { type: String },
    publico: { type: Boolean, default: true },
    estado: { type: Boolean, default: true },
    archivos: [{ type: Schema.Types.ObjectId, ref: "doc_evaluacionfile" }],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEvaluacion>("doc_evaluacion", evaluacionSchema);
