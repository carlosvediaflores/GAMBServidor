import mongoose, { Schema, Document, Number } from "mongoose";
import salidaModel, { ISalida } from "../models/salida";
export interface ICompra extends Document {
  ubicacion:string;
  cantidadCompra: number;
  stockCompra:number;
  factura: string
  estadoCompra: string;
  catProgra:string;
  precio:number;
  idProducto:string;
  idArticulo:string;
  idEntrada: string;
  idVehiculo:string;
  salidas: Array<ISalida>
}
const compraSchema: Schema = new Schema(
  {
    ubicacion: { type: String },
    cantidadCompra: { type: Number, default:0 },
    stockCompra: { type: Number, default:0 },
    factura:{type: String},
    estadoCompra: {type:String, default:"EXISTE"},
    catProgra: { type: String },
    precio: { type: Number, default:0 },
    idProducto:{type: String},
    idArticulo: {type: Schema.Types.ObjectId, ref: "alm_articulos" },
    idEntrada: { type: Schema.Types.ObjectId, ref: "alm_ingresos" },
    idVehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
    salidas: [{ type: Schema.Types.ObjectId, ref: "alm_salidas"}]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICompra>("alm_compras", compraSchema);
