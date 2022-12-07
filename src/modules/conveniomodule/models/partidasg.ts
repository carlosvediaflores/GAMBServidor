import mongoose, { Schema, Document, Number } from "mongoose";
export interface IPartidas extends Document {
    denominacion: string;
    codigo: string;
  }
  const entitySchema: Schema = new Schema({
    denominacion:{ type: String, required: true },
    codigo:{type: String, required: true, unique: true}
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<IPartidas>("partidas", entitySchema);