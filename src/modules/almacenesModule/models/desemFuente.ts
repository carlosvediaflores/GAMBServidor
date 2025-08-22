import mongoose, { Schema, Document, Number } from "mongoose";
export interface IdesemFuente extends Document {
  gestion: number;
  montoTotal?: number;
  montoGasto?: number;
  idDesembolso?: string;
  idFuente: string;
  fechaDesembolso?: string;
  beneficiario: string;
  idUserRegister: string;
  tipoFondo: string; // fondo rotatatorio, en avance
  fuente: string;
  denominacionFuente: string;
}
const desemFuenteSchema: Schema = new Schema(
  {
    montoTotal: { type: Number,  default: 0 },
    gestion: { type: Number },
    montoGasto: { type: Number, default: 0 },
    idDesembolso: { type: Schema.Types.ObjectId, ref: "alm_desembolso"},
    idFuente: { type: Schema.Types.ObjectId, ref: "alm_fuente", },
    fechaDesembolso: { type: String, default: Date.now },
    beneficiario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    idUserRegister:{type:Schema.Types.ObjectId, ref: "User"},
    tipoFondo: { type: String, required: true },
    fuente: { type: String, required: true },
    denominacionFuente: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IdesemFuente>("alm_desemFuente", desemFuenteSchema);