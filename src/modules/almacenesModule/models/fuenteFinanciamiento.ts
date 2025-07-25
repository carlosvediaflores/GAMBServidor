import mongoose, { Schema, Document, Number } from "mongoose";
export interface IfuenteFinanciamiento extends Document {
  codigo?: string;
  denominacion: string;
  sigla?: string;
}
const fuenteFinanciamientoSchema: Schema = new Schema(
  {
    codigo: { type: String, required: true, unique: true },
    denominacion: { type: String, required: true, unique: true },
    sigla: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IfuenteFinanciamiento>("alm_fuente_financiamientos", fuenteFinanciamientoSchema);