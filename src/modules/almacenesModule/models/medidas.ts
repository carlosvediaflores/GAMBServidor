import mongoose, { Schema, Document, Number } from "mongoose";
export interface IMedida extends Document {
  unidadMedida: string;
  simbolo: string;
}
const medidasSchema: Schema = new Schema(
  {
    unidadMedida: { type: String },
    simbolo: { type: String},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IMedida>("alm_Medidas", medidasSchema);