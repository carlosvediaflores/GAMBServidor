import mongoose, { Schema, Document, Number } from "mongoose";
export interface IorganismoFinanciador extends Document {
  codigo?: string;
  denominacion: string;
  sigla?: string;
}
const organismoFinanciadorSchema: Schema = new Schema(
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
export default mongoose.model<IorganismoFinanciador>("alm_organismo_financiadores", organismoFinanciadorSchema);