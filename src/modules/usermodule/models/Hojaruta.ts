import { IFiles } from './Files';
import paginate from 'mongoose-paginate-v2';
import mongoose, { Schema, Document } from "mongoose";
import SeguimientoModel, { ISeguimiento } from "./Seguimiento";
export interface ISimpleHojaruta {
  nuit?: string;//7
  fecharesepcion?: Date; //6
  fechadocumento?: Date;//5
  tipodoc?: string;
  origen?: string;//8
  estado?: string; //4
  contacto?:string;
  referencia?: string;//9
  seguimiento?: Array<ISeguimiento>;//10
  urihoja?: string; //11
  pathhoja?: string;//12
  archivo?:Array<IFiles>; //3
  asociado?:Array<IHojaruta>;//13
}
export interface IHojaruta extends Document {

  nuit: string;
  fecharesepcion: Date;
  fechadocumento: Date;
  tipodoc: string;
  origen: string;
  estado: string;
  contacto: string;
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
  contacto: {type: String},
  referencia: { type: String },
  seguimiento: { type: Array },
  urihoja: {type: String},
  pathhoja: {type: String},
  archivo:  {type:Array},
  asociado: {type:Array}
});
hojarutaSchema.plugin(paginate);
export default mongoose.model<IHojaruta, mongoose.PaginateModel<IHojaruta>>("Hojaruta", hojarutaSchema);
