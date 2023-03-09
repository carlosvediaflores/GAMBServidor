import mongoose, { Schema, Document, Number } from "mongoose";
export interface ISegPoa extends Document {
  cat_programatica: string;
  partida: string;
  proyect_acti: string;
  presupuesto_vigente: string;
  ejecucion_presupuestaria:string;
  saldo:number;
  etapa:string
}
const SegPoaSchema: Schema = new Schema(
  {
    cat_programatica: { type: String },
    partida: { type: String},
    proyect_acti: { type: String },
    presupuesto_vigente:{type: String},
    ejecucion_presupuestaria:{type: String},
    saldo:{type: Number},
    etapa:{type:String},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ISegPoa>("alm_SegPoas", SegPoaSchema);
