import mongoose, { Schema, Document, Number } from "mongoose";
export interface IActividad extends Document {
  id_programa: string;
  codigo: string;
  cat_prog: string;
  denominacion: string;
}
const actividadSchema: Schema = new Schema(
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
export default mongoose.model<IActividad>("alm_actividades", actividadSchema);