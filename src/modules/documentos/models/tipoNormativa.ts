import mongoose, { Schema, Document} from "mongoose";

export interface ITipoNormativa extends Document {
  tipo: string;
  normativa:[];
}
const tipoNormativaSchema: Schema = new Schema(
  {
    tipo: { type: String },
    normativa: [{ type: Schema.Types.ObjectId, ref: "doc_normativas" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ITipoNormativa>(
    "doc_tipoNormativas",
    tipoNormativaSchema
);
