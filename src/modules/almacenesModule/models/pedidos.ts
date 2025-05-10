import mongoose, { Schema, Document, Number } from "mongoose";
import egresopModel, { IEgreso } from "./egreso";
import { ISalida } from "./salida";

export interface IPedidos extends Document {
  productos: Array<ISalida>;
  concepto: string;
  fecha: number;
  fechaContrato: Date;
  plazo:number;
  numeroEntrada:number;
  estado: string;
  tipo:string;
  idPersona: string;
  idProveedor: string;
  idUsuario: string;
  idEgreso: Array<IEgreso>;
}
const pedidosSchema: Schema = new Schema(
  {
    productos: { type: Array, default:[] },
    //productos: [{ type: Schema.Types.ObjectId, ref: "alm_compras"}],
    concepto: { type: String },
    fechaAprobacion: { type: Date, default:new Date},
    fechaPedido: { type: Date, default:new Date},
    numeroPedido: { type: Number, default:1},
    estado: {type: String, default:"REGISTRADO"},
    tipo:{type:String, default:"MATERIAL"},
    // idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idPersona: { type: Schema.Types.ObjectId, ref: "User" },
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
    idEgreso: [{ type: Schema.Types.ObjectId, ref: "alm_egresos"}],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IPedidos>("alm_pedidos", pedidosSchema);
