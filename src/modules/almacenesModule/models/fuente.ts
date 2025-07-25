import mongoose, { Schema, Document, Number } from "mongoose";
export interface Ifuente extends Document {
  ffof?: string;
  sigla?: string;
  denominacion: string;
  idff: string; // ID de la fuente de financiamiento
  idof: string; // ID del organismo financiador
}
const fuenteSchema: Schema = new Schema(
  {
    ffof: { type: String, required: true, unique: true },
    sigla: { type: String, required: true, unique: true },
    denominacion: { type: String, required: true, unique: true },
    idff: { type: Schema.Types.ObjectId, ref: "alm_fuente_financiamientos", required: true },
    idof: { type: Schema.Types.ObjectId, ref: "alm_organismo_financiadores", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<Ifuente>("alm_fuente", fuenteSchema);