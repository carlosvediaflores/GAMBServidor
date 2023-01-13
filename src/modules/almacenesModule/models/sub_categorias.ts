import mongoose, { Schema, Document, Number } from "mongoose";
export interface ISubCategoria extends Document {
    denominacion: string;
    codigo: string;
    idcategoria: string;
  }
  const entitySchema: Schema = new Schema({
    denominacion:{ type: String, required: true, unique: true },
    codigo:{type: String, required: true, unique: true},
    idcategoria: { type: Schema.Types.ObjectId, ref: 'alm_categoria'}
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ISubCategoria>("alm_sub_categoria", entitySchema);