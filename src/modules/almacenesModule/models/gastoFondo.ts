import mongoose, { Schema, Document, Number } from "mongoose";
export interface IgastoFondo extends Document {
  
  denominacion: string;
  idPartida: string; // Reference to the partida model
}
const gastoFondoSchema: Schema = new Schema(
  {
    
    denominacion: { type: String, required: true, unique: true },
    idPartida: { type: Schema.Types.ObjectId, ref: "partidas" },
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IgastoFondo>("alm_gastoFondo", gastoFondoSchema);