import { IFiles } from './Files';

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
  seguimiento?: Array<ISeguimiento>;
  urihoja?: string;
  pathhoja?: string;
  archivo?:Array<IFiles>;
  asociado?:Array<IHojaruta>;
}
export interface IHojaruta extends Document {

  nuit: string;
  fecharesepcion: Date;
  fechadocumento: Date;
  tipodoc: string;
  origen?: string;
  estado?: string;
  referencia: string;
  seguimiento: Array<ISeguimiento>;
  urihoja: string;
  pathhoja: string;
  archivo:Array<IFiles>;
  asociado:Array<IHojaruta>;
}
const hojarutaSchema: Schema = new Schema({
  nuit: { type: String, required: true, unique: true },
  fecharesepcion: { type: Date, default: Date.now },
  fechadocumento: { type: Date },
  tipodoc: { type: String },
  origen: { type: String },
  estado: { type: String },
  referencia: { type: String },
  seguimiento: { type: Array },
  urihoja: {type: String},
  pathhoja: {type: String},
  archivo:  {type:Array},
  asociado: {type:Array}
});
export default mongoose.model<IHojaruta>("Hojaruta", hojarutaSchema);

/*var arch: any = hojaToUpdate.archivo
      arch.urihoja  = "gethojaruta/" + id;
      arch.pathhoja = totalpath;
      arch.pathhoja = newname;
      */