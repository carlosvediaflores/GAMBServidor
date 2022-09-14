import mongoose, { Schema, Document } from "mongoose";
import { IRepresentante } from "./Representante";

export interface ISimpleEntidad {
    nombre?: string;
    representantes?: Array<IRepresentante>;
    telefono?: string;
    nit?: number;
    email?: string;
    urilogo?: string;
    pathlogo?: string;
  }
export interface IEntidad extends Document {
    nombre: string;
    representantes: Array<IRepresentante>;
    telefono: string;
    nit: number;
    email: string;
    urilogo: string;
    pathlogo: string;
  }
  const entidadSchema: Schema = new Schema({
    nombre:{ type: String, requiered: true, unique: true },
    representantes: { type: Array },
    telefono: { type: String, unique: true},
    nit: {type: Number, unique: true},
    email: { type: String, unique: true},
    urilogo: { type: String},
    pathlogo: { type: String}
    
  });

export default mongoose.model<IEntidad>("entidades", entidadSchema);