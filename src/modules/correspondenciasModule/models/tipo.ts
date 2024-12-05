import mongoose, { Schema, Document, Number } from "mongoose";
export interface ITipo extends Document {
  nombreTipo:string;
  siglaTipo: string;
  idSubTipos: [];
}
const areaSchema: Schema = new Schema(
  {
    nombreTipo: { type: String, unique:true,lowercase: true, trim: true },
    siglaTipo: { type: String, trim: true},
    idSubTipos: [{ type: Schema.Types.ObjectId, ref: "corr_subTipo" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ITipo>("corr_Tipo", areaSchema);
