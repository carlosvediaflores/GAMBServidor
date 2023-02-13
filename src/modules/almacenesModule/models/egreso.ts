import mongoose, { Schema, Document } from "mongoose";
export interface IEgreso extends Document {
  articulos: [];
  categoriaProgra: string;
  concepto: string;
  fecha: number;
  numeroFactura: string;
  numero:number;
  estado: boolean;
  idProveedor: string;
  idPersona: string;
  idUsuario: string;
}
const egresoSchema: Schema = new Schema(
  {
    articulos: { type: Array},
    categoriaProgra: { type: String, required: true},
    concepto: { type: String },
    fecha: { type: Date, default:new Date},
    numeroFactura: { type: String },
    numero: { type: Number},
    estado: {type: Boolean, default:true},
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEgreso>("alm_egresos", egresoSchema);
