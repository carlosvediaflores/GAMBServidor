import mongoose, { Schema, Document, Number, Types } from "mongoose";
import { IdesemFuente } from "./desemFuente";
export interface Idesembolso extends Document {
  numero?: number;
  fechaDesembolso?: string;
  gestion: number;
  beneficiario: string;
  montoTotal: number;
  montoGasto: number;
  montoAsignado?: number;
  tipoDesembolso: string;
  idTipoDesembolso:string;
  numDesembolso:string;
  estado: string;
  idFuentes: [];
  gastos: [string];
  idUserRegister: string;
  isClosed:boolean;
}
const desembolsoSchema: Schema = new Schema(
  {
    numero: { type: Number, default: 1},
    fechaDesembolso: { type: String, default: Date.now },
    gestion: { type: Number},
    beneficiario: {type:Schema.Types.ObjectId, ref: "User", required: true },
    montoTotal: { type: Number, default: 0 },
    montoGasto: { type: Number, default: 0 },
    montoAsignado: { type:Number, default: 0 },
    tipoDesembolso: { type:String, required: true },
    idTipoDesembolso: { type: Schema.Types.ObjectId, ref: "alm_tipoDesembolso"},
    numDesembolso:{ type: String,},
    isClosed:{type:Boolean, default:false},
    estado: { type: String,  default: "SIN MOVIMIENTO" },
    idFuentes: [{ type: Schema.Types.ObjectId, ref: "alm_desemFuente", default:[]}],
    gastos: [{ type:Schema.Types.ObjectId, ref: "alm_gasto", default: [] }],
    idUserRegister:{type:Schema.Types.ObjectId, ref: "User"},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<Idesembolso>("alm_desembolso", desembolsoSchema);
