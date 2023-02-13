import mongoose, { Schema, Document } from "mongoose";
export interface ICounter extends Document {
  vistas: number;
}
const counterSchema: Schema = new Schema(
  {
    visitas: { type: Number, default:1},
  },
  {
    versionKey: false,
  }
);
export default mongoose.model<ICounter>("counters", counterSchema);
