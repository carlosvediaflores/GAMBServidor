import mongoose, { Schema, Document, Number } from "mongoose";

export interface IEjecucionFile extends Document {
  documento: string;
  uri: string;
  path: string;
  nameFile: string;
}
const ejecucionFileSchema: Schema = new Schema(
  {

    documento: { type: String },
    uri: { type: String },
    path: { type: String },
    nameFile: { type: String },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEjecucionFile>("doc_ejecucionfile", ejecucionFileSchema);
