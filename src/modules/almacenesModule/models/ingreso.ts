import mongoose, { Schema, Document, Number } from "mongoose";
export interface IIngreso extends Document {
  articulos: [];
  categoriaProgra: string;
  concepto: string;
  fecha: number;
  numeroFactura: string;
  estado: boolean;
  idProveedor: string;
  idUsuario: string;
}
const ingresoSchema: Schema = new Schema(
  {
    articulos: { type: Array},
    categoriaProgra: { type: String, required: true},
    concepto: { type: String },
    fecha: { type: Date, default:new Date},
    numeroFactura: { type: String },
    estado: {type: Boolean, default:true},
    idProveedor: { type: Schema.Types.ObjectId, ref: "partidas" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IIngreso>("alm_ingresos", ingresoSchema);
