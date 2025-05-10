import mongoose, { Schema, Document, Number } from "mongoose";

export interface IsegControl extends Document {
  titulo: string;
  fecha: Date;
  estado:boolean;
  uri: string;
  path: string;
  nameFile: string;
  modelo_tipo:string;
  idUsuario: string;
}
const segControlSchema: Schema = new Schema(
  {
    titulo: { type: String },
    fecha: { type: Date, default: Date.now },
    estado: { type: Boolean, default:true },
    uri: { type: String },
    path: { type: String },
    nameFile: { type: String },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IsegControl>(
  "seg_control_int",
  segControlSchema
);
