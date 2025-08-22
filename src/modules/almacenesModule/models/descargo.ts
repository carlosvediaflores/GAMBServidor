import mongoose, { Schema, Document, Number, Types } from "mongoose";
export interface Idescargo extends Document {
  numero?: number;
  fechaDescargo?: string;
  gestion: number;
  encargado: string;
  montoDescargo: number;
  tipoDesembolso: string;
  idTipoDesembolso:string;
  numDescargo:string;
  estado: string;
  gastos: [string];
  idUserRegister: string;
  isClosed:boolean;
}
const descargoSchema: Schema = new Schema(
  {
    numero: { type: Number, default: 1},
    fechaDescargo: { type: String, default: Date.now },
    gestion: { type: Number},
    encargado: {type:Schema.Types.ObjectId, ref: "User", required: true },
    montoDescargo: { type: Number, default: 0 },
    tipoDesembolso: { type:String, required: true },
    idTipoDesembolso: { type: Schema.Types.ObjectId, ref: "alm_tipoDesembolso"},
    numDescargo:{ type: String,},
    isClosed:{type:Boolean, default:false},
    estado: { type: String,  default: "PENDIENTE" },
    gastos: [{ type:Schema.Types.ObjectId, ref: "alm_gasto", default: [] }],
    idUserRegister:{type:Schema.Types.ObjectId, ref: "User"},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<Idescargo>("alm_descargo", descargoSchema);
