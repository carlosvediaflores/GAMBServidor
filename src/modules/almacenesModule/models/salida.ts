import mongoose, { Schema, Document, Number } from "mongoose";
export interface ISalida extends Document {
  cantidadSalida: number;
  estadoSalida: string;
  catProgra:string;
  idCompra:string;
  idEgreso:string;
  /* idArticulo:string;
  idEntrada: string; */
}
const salidaSchema: Schema = new Schema(
  {
    cantidadSalida: { type: Number, default:0 },
    estadoSalida: {type:String, default:"SIN OBS"},
    catProgra: { type: String },
    idCompra: {type: Schema.Types.ObjectId, ref: "alm_compras" },
    idEgreso:{type: Schema.Types.ObjectId, ref: "alm_egresos" },
    /* idArticulo: {type: Schema.Types.ObjectId, ref: "alm_articulos" },
    idEntrada: { type: Schema.Types.ObjectId, ref: "alm_ingresos" }, */
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ISalida>("alm_salidas", salidaSchema);
