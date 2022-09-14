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
  }
  const represSchema: Schema = new Schema({
    nombre:{ type: String, requiered: true },
    apellidos: { type: String, requiered: true },
    cargo: { type: String, requiered: true},
    telefono: {type: String},
    ci: {type: String, unique: true},
    email: { type: String, unique: true},
    urirepres: { type: String},
    pathrepres: { type: String}
    
  });

export default mongoose.model<IRepresentante>("representantes", represSchema);