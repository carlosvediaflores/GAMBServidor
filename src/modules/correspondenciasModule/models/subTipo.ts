import mongoose, { Schema, Document} from "mongoose";
export interface ISubTipo extends Document {
  nombreSubTipo:string;
    siglaSubTipo: string;
    idTipo: string;
}
const areaSchema: Schema = new Schema(
  {
    nombreSubTipo: { type: String },
    siglaSubTipo: { type: String },
    idTipo: { type: Schema.Types.ObjectId, ref: "corr_Tipo" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ISubTipo>("corr_subTipo", areaSchema);
