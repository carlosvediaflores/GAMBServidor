import mongoose, { Schema, Document, Number } from "mongoose";
export interface IIngreso extends Document {
  articulos: [];
  categoriaProgra: string;
  concepto: string;
  fecha: number;
  numeroFactura: string;
  numero:number;
  estado: boolean;
  idPersona: string;
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
    numero: { type: Number, default:1},
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
export default mongoose.model<IIngreso>("alm_ingresos", ingresoSchema);
