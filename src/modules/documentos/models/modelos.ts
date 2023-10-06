import mongoose, { Schema, Document} from "mongoose";

export interface IModelo extends Document {
  tipo: string;
  documentos:[];
}
const modeloSchema: Schema = new Schema(
  {
    tipo: { type: String },
    documentos: [{ type: Schema.Types.ObjectId, ref: "model_documents" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IModelo>(
  "model_tipos",
  modeloSchema
);
