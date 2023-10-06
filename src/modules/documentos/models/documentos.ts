import mongoose, { Schema, Document, Number } from "mongoose";

export interface IDocumento extends Document {
  titulo: string;
  fecha: Date;
  vigente:boolean;
  uri: string;
  path: string;
  nameFile: string;
  modelo_tipo:string;
  idUsuario: string;
}
const documentoSchema: Schema = new Schema(
  {
    titulo: { type: String },
    fecha: { type: Date },
    vigente: { type: Boolean, default:true },
    uri: { type: String },
    path: { type: String },
    nameFile: { type: String },
    modelo_tipo: { type: Schema.Types.ObjectId, ref: "model_tipos" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IDocumento>(
  "model_documents",
  documentoSchema
);
