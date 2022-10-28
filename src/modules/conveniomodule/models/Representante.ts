import mongoose, { Schema, Document } from "mongoose";
export interface ISimpleRepresentante {
    nombre?: string;
    apellidos?: string;
    cargo?: string;
    telefono?: string;
    ci?: string;
    email?: string;
    urirepres?: string;
    pathrepres?: string;
    estado?: boolean
  }
export interface IRepresentante extends Document {
    nombre: string;
    apellidos: string;
    cargo: string;
    telefono: string;
    ci: string;
    email: string;
    urirepres: string;
    pathrepres: string;
    estado: boolean
  }
  const represSchema: Schema = new Schema({
    nombre:{ type: String, required: true },
    apellidos: { type: String, required: true },
    cargo: { type: String, required: true},
    telefono: {type: String},
    ci: {type: String},
    email: { type: String},
    urirepres: { type: String},
    pathrepres: { type: String},
    estado:{type:Boolean, default:true}
  }, {
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<IRepresentante>("cvrepresentantes", represSchema);