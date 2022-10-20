import mongoose, { Schema, Document } from "mongoose";
import { IRepresentante } from "./Representante";

export interface ISimpleEntidad {
    nombre?: string;
    representante?: Array<IRepresentante>;
    telefono?: string;
    nit?: number;
    email?: string;
    urilogo?: string;
    pathlogo?: string;
    cuenta?:number;
    montofinan?:number;  
  }
export interface IEntidad extends Document {
    nombre: string;
    representante: Array<IRepresentante>;
    telefono: string;
    nit: number;
    email: string;
    urilogo: string;
    pathlogo: string;
    cuenta:number;  
    montofinan:number; 
  }
  const entidadSchema: Schema = new Schema({
    nombre:{ type: String, requiered: true, unique: true },
    representante: {type: [Schema.Types.ObjectId], ref: "cvrepresentantes" } ,
    telefono: { type: String, unique: true},
    nit: {type: Number, unique: true},
    email: { type: String, unique: true},
    urilogo: { type: String},
    pathlogo: { type: String},
    cuenta: { type: Number},
    montofinan: { type: Number}
  },{
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IEntidad>("cventidades", entidadSchema);