import mongoose, { Schema, Document, Number } from "mongoose";
import { IRepresentante } from "./Representante";
export interface IEntity extends Document {
  denominacion: string;
  codigo: string;
  sigla: string;
  representante: Array<IRepresentante>;
  telefono: string;
  nit: number;
  cuenta: number;
  isActive?: boolean;
  estado?: boolean;
  tipoEntidad?: string;
}
const entitySchema: Schema = new Schema(
  {
    denominacion: { type: String, required: true, unique: true },
    sigla: { type: String, required: true, unique: true },
    codigo: { type: String, required: true, unique: true },
    representante: { type: [Schema.Types.ObjectId], ref: "cvrepresentantes" },
    telefono: { type: String },
    nit: { type: Number },
    cuenta: { type: Number },
    isActive: { type: Boolean, default: true }, // New field to indicate if the entity is active
    estado: { type: Boolean, default: true }, // New field to indicate the estado of the entity
    tipoEntidad: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IEntity>("entities", entitySchema);
