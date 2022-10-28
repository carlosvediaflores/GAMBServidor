import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleDesembolso {
  fecha?: Date;
  fuente?: string;
  cuenta?: string;
  uriconpro?: string;
  pathcompro?: string;
}
export interface IDesembolso extends Document {
  fecha: Date;
  fuente: string;
  cuenta: string;
  uriconpro: string;
  pathcompro: string;
}
const desSchema: Schema = new Schema(
  {
    fecha: { type: String, required: true },
    fuente: { type: String, required: true },
    cuenta: { type: String, required: true },
    uriconpro: { type: String },
    pathcompro: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IDesembolso>("cvdesembolso", desSchema);
