import mongoose, { Schema, Document, Decimal128 } from "mongoose";
import { IEntidad } from "./Entidad";

export interface ISimpleConvenio {
    codigo?: string;
    objeto?: string;
    entidad?: Array<IEntidad>;
    fechafirma?: Date;
    representantes?: string;
    monto?:number;
    plazo?: string;
    estado?: string;
    entiejecutora?: string;
    desembolso?: string;
    estadomonto?: string;
    tipo?: string;
  }
export interface IConvenio extends Document {
    codigo: string;
    objeto: string;
    entidad: Array<IEntidad>;
    fechafirma: Date;
    representantes: string;
    monto:number;
    plazo: string;
    estado: string;
    entiejecutora: string;
    desembolso: string;
    estadomonto: string;
    tipo: string;
    user: string
  }
  const convenioSchema: Schema = new Schema({
    codigo:{ type: String, requiered: true },
    objeto: { type: String },
    entidad:  {type: [Schema.Types.ObjectId], ref: "cventidades" },
    fechafirma: {type: Date, requiered: true},
    representantes: { type: String},
    monto: { type: String, requiered: true},
    plazo: { type: String, requiered: true},
    estado:{type: String, requiered: true},
    empresaejecutora: {type: String},
    desembolso: {type: String},
    estadomonto: {type: String, requiered: true},
    tipo: {type: String, requiered: true},
    user: {type: Schema.Types.ObjectId, ref: 'User',required: true}
    
  },
  {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IConvenio>("cvconvenio", convenioSchema);