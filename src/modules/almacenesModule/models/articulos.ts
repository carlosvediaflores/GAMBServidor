import mongoose, { Schema, Document, Number } from "mongoose";
export interface IArticulo extends Document {
  codigo: string;
  nombre: string;
  unidadMedida: string;
  cantidad: number;
  estado: boolean;
  idPartida: string;
  idUsuario: string;
}
const articuloSchema: Schema = new Schema(
  {
    codigo: { type: String, required: true, unique: true},
    nombre: { type: String, required: true, unique: true },
    unidadDeMedida: { type: String },
    cantidad: { type: Number, default:0 },
    estado: {type: Boolean, default:true},
    idPartida: { type: Schema.Types.ObjectId, ref: "partidas" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IArticulo>("alm_articulos", articuloSchema);
