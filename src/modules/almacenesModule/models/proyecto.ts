import mongoose, { Schema, Document, Number } from "mongoose";
export interface IProyecto extends Document {
  id_programa: string;
  codigo: string;
  cat_prog: string;
  denominacion: string;
}
const proyectoSchema: Schema = new Schema(
  {
    id_programa: { type: Schema.Types.ObjectId, ref: 'alm_programa'},
    codigo: { type: String, required: true, unique: true },
    cat_prog:{type: String},
    denominacion: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IProyecto>("alm_proyectos", proyectoSchema);
