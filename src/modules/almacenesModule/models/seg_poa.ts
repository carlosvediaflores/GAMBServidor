import mongoose, { Schema, Document, Number } from "mongoose";
export interface ISegPoa extends Document {
  cat_programatica: string;
  partida: string;
  proyect_acti: string;
  presupuesto_inicial: string
}
const SegPoaSchema: Schema = new Schema(
  {
    cat_programatica: { type: String },
    partida: { type: String},
    proyect_acti: { type: String },
    presupuesto_inicial:{type: String}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ISegPoa>("alm_SegPoas", SegPoaSchema);
