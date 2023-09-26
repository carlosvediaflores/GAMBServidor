import mongoose, { Schema, Document, Number } from "mongoose";
export interface ISegPoa extends Document {
  area:string;
  cat_programatica: string;
  partida: string;
  proyect_acti: string;
  presupuesto_vigente: string;
  ejecucion_presupuestaria:string;
  saldo:string ;
  etapa:string
  responsable:string
}
const SegPoaSchema: Schema = new Schema(
  {
    area: { type: String },
    cat_programatica: { type: String, required: true, unique: true },
    partida: { type: String},
    proyect_acti: { type: String, required: true, unique: true },
    presupuesto_vigente:{type: String},
    ejecucion_presupuestaria:{type: String},
    saldo:{type: String},
    etapa:{type:String},
    responsable:{ type: Schema.Types.ObjectId, ref: 'User'}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ISegPoa>("alm_SegPoas", SegPoaSchema);
