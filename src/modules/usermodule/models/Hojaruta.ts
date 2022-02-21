
import mongoose, { Schema, Document } from "mongoose";
import SeguimientoModel, { ISeguimiento } from "./Seguimiento";
export interface ISimpleHojaruta {
  nuit?: string;
  fecharesepcion?: Date;
  fechadocumento?: Date;
  tipodoc?: string;
  origen?: string;
  estado?: string;
  referencia?: string;
  archivo?: string;
  seguimiento?: Array<ISeguimiento>;
  urihoja?: string;
  pathhoja?: string;
}
export interface IHojaruta extends Document {
  Array: any;
  nuit: string;
  fecharesepcion: Date;
  fechadocumento: Date;
  tipodoc: string;
  origen?: string;
  estado?: string;
  referencia: string;
  archivo: string;
  seguimiento: Array<ISeguimiento>;
  urihoja: string;
  pathhoja: string;
}
const hojarutaSchema: Schema = new Schema({
  nuit: { type: String, required: true, unique: true },
  fecharesepcion: { type: Date, default: Date.now },
  fechadocumento: { type: Date },
  tipodoc: { type: String },
  origen: { type: String },
  estado: { type: String },
  referencia: { type: String },
  archivo: { type: String },
  seguimiento: { type: Array },
  urihoja: {type: String},
  pathhoja: {type: String}
});
export default mongoose.model<IHojaruta>("Hojaruta", hojarutaSchema);