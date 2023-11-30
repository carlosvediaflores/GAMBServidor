import mongoose, { Schema, Document, Number } from "mongoose";

export interface IFileEvaluacion extends Document {
  documento: string;
  uri: string;
  path: string;
  nameFile: string;
}
const FileEvaluacionSchema: Schema = new Schema(
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
export default mongoose.model<IFileEvaluacion>("doc_evaluacionfile", FileEvaluacionSchema);
