import mongoose, { Schema, Document, Number } from "mongoose";
export interface ITipo extends Document {
  nombreTipo:string;
  siglaTipo: string;
  idSubTipos: [];
}
const areaSchema: Schema = new Schema(
  {
    nombreTipo: { type: String, unique:true },
    siglaTipo: { type: String },
    idSubTipos: [{ type: Schema.Types.ObjectId, ref: "corr_subTipo" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ITipo>("corr_Tipo", areaSchema);
