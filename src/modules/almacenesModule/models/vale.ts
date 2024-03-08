import mongoose, { Schema, Document, Number } from "mongoose";
export interface IVale extends Document {
  numeroVale: number;
  fecha: Date;
  cantidad: number;
  catProgra: string;
  autorizacion:string;
  idProducto:string;
  encargadoControl: string;
  idCompra: string;
  idEgreso: string;
}
const valeSchema: Schema = new Schema(
  {
    numeroVale: { type: Number },
    fecha: { type: Date, default:new Date()},
    cantidad: { type: Number, default: 0 },
    catProgra: { type: String },
    idProducto:{ type: Schema.Types.ObjectId, ref: "alm_articulos" },
    autorizacion:{ type: Schema.Types.ObjectId, ref: "act_autorizations" },
    encargadoControl: { type: Schema.Types.ObjectId, ref: "User" },
    idCompra: { type: Schema.Types.ObjectId, ref: "alm_compras" },
    idEgreso: { type: Schema.Types.ObjectId, ref: "alm_egresos" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IVale>("alm_vale", valeSchema);
