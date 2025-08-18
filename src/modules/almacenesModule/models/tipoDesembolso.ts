import mongoose, { Schema, Document, Number } from "mongoose";
export interface ItipoDesem extends Document {
  desembolsos:[];
  denominacion: string;
}
const tipoDesemSchema: Schema = new Schema(
  {
    desembolsos: { type: [Schema.Types.ObjectId], ref: "alm_desembolso", default: [] },
    denominacion: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ItipoDesem>("alm_tipoDesembolso", tipoDesemSchema);