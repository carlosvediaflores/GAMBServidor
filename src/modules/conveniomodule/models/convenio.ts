import mongoose, { Schema, Document, Decimal128 } from "mongoose";

export interface ISimpleConvenio {
    nombre?: string;
    objeto?: string;
    entidad?: string;
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
    nombre: string;
    objeto: string;
    entidad: string;
    fechafirma: Date;
    representantes: string;
    monto:number;
    plazo: string;
    estado: string;
    entiejecutora: string;
    desembolso: string;
    estadomonto: string;
    tipo: string;
  }
  const convenioSchema: Schema = new Schema({
    nombre:{ type: String, requiered: true },
    objeto: { type: String },
    entidad: { type: String},
    fechafirma: {type: Date, requiered: true},
    representantes: { type: String},
    monto: { type: String, requiered: true},
    plazo: { type: String, requiered: true},
    estado:{type: String, requiered: true},
    entiejecutora: {type: String},
    desembolso: {type: String},
    estadomonto: {type: String, requiered: true},
    tipo: {type: String, requiered: true}
    
  });

export default mongoose.model<IConvenio>("convenio", convenioSchema);