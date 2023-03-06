import mongoose, { Schema, Document, Number } from "mongoose";
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICompra>("alm_compras", compraSchema);
