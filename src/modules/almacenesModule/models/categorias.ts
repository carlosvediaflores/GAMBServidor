import mongoose, { Schema, Document, Number } from "mongoose";
export interface ICategoria extends Document {
    denominacion: string;
    codigo: string;
  }
  const entitySchema: Schema = new Schema({
    denominacion:{ type: String, required: true, unique: true },
    codigo:{type: String, required: true, unique: true},
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ICategoria>("alm_categoria", entitySchema);