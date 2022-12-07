import mongoose, { Schema, Document, Number } from "mongoose";
export interface IEntity extends Document {
    denominacion: string;
    codigo: number;
    sigla:string;
  }
  const entitySchema: Schema = new Schema({
    denominacion:{ type: String, required: true, unique: true },
    sigla:{type: String, required: true, unique: true},
    codigo:{type: Number, required: true, unique: true},
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<IEntity>("entities", entitySchema);