import mongoose, { Schema, Document, Number } from "mongoose";

export interface INormativa extends Document {
  numero:string;
  titulo: string;
  fecha: Date;
  fechaFin: Date;
  vigente:boolean;
  estado:boolean;
  uri: string;
  path: string;
  nameFile: string;
  tipo_normativa:string;
  idUsuario: string;
}
const normativaSchema: Schema = new Schema(
  {
    numero: { type: Number, default:0 },
    titulo: { type: String },
    fecha: { type: Date, default:new Date},
    fechaFin: { type: Date },
    vigente: { type: Boolean, default:true },
    estado: { type: Boolean, default:true },
    uri: { type: String },
    path: { type: String },
    nameFile: { type: String },
    tipo_normativa: { type: Schema.Types.ObjectId, ref: "doc_tipoNormativas" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<INormativa>(
  "doc_normativas",
  normativaSchema
);
