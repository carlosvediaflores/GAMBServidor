import mongoose, { Schema, Document, Number } from "mongoose";

export interface IFilePrestamos extends Document {
  documento: string;
  uri: string;
  path: string;
  nameFile: string;
}
const fielPrestamoSchema: Schema = new Schema(
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
export default mongoose.model<IFilePrestamos>("doc_fileprestamos", fielPrestamoSchema);
