import mongoose, { Schema, Document, Number } from "mongoose";
export interface ItipoDesem extends Document {
  desembolsos: [];
  descargos: [];
  denominacion: string;
  montoAcumulado: number;
  montoEjecutado: number;
}
const tipoDesemSchema: Schema = new Schema(
  {
    desembolsos: { type: [Schema.Types.ObjectId], ref: "alm_desembolso", default: [] },
    descargos: { type: [Schema.Types.ObjectId], ref: "alm_descargo", default: [] },
    denominacion: { type: String, required: true, unique: true },
    montoAcumulado: { type: Number, default: 0 },
    montoEjecutado: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ItipoDesem>("alm_tipoDesembolso", tipoDesemSchema);