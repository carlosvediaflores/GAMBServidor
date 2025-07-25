import mongoose, { Schema, Document, Number } from "mongoose";
export interface ItipoDesem extends Document {
  
  denominacion: string;
}
const tipoDesemSchema: Schema = new Schema(
  {
    
    denominacion: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ItipoDesem>("alm_tipoDesembolso", tipoDesemSchema);