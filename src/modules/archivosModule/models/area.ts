import mongoose, { Schema, Document, Number } from "mongoose";
export interface IArea extends Document {
  nombre: string;
  tipos: [];
}
const areaSchema: Schema = new Schema(
  {
    nombre: { type: String },
    tipos: { type: Array },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IArea>("arch_areas", areaSchema);
