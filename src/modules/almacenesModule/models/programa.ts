import mongoose, { Schema, Document, Number } from "mongoose";
export interface IPrograma extends Document {
  gestion: string;
  codigo: string;
  denominacion: string;
}
const programaSchema: Schema = new Schema(
  {
    gestion: { type: Number },
    codigo: { type: String, required: true, unique: true },
    denominacion: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IPrograma>("alm_programa", programaSchema);
