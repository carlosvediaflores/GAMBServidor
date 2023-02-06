import mongoose, { Schema, Document } from "mongoose";
export interface IRendicion extends Document {
  gestion: number;
  titulo: string;
  descripcion: string;
  ley: string;
  archivo: string;
  estado: boolean;
  uri:string;
  path:string;
  usuario: string;
}
const rendicionSchema: Schema = new Schema(
  {
    gestion: { type: Number },
    titulo: { type: String },
    descripcion: { type: String },
    ley: { type: Schema.Types.ObjectId, ref: "wpgaceta" },
    archivo: { type: String },
    estado: { type: Boolean, default: false },
    uri:{type: String},
    path:{type: String},
    usuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IRendicion>("wp_rendiciones", rendicionSchema);
