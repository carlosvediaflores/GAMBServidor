import mongoose, { Schema, Document, Decimal128 } from "mongoose";
import { IEntidad } from "./Entidad";
import { IFilescv } from "./files";

export interface IConvenio extends Document {
    codigo: string;
    nombre: string;
    objeto: string;
    entidades: Array<IEntidad>;
    firma: Date;
    representantes: string;
    montototal:number;
    plazo: number;
    estado: string;
    entidadejecutora: string;
    empresaecutota:string;
    desembolso: string;
    estadomonto: string;
    tipo: string;
    user: string;
    files: Array<IFilescv>
  }
  const convenioSchema: Schema = new Schema({
    codigo:{ type: String, required: true },
    nombre:{type:String},
    objeto: { type: String },
    //entidades:  [{ type: Schema.Types.ObjectId, ref: "cventidades"}],
    //entidades:  {type: [Schema.Types.ObjectId], ref: "cventidades"},
    entidades: {type: Array},
    firma: {type: Date},
    plazo: { type: Number},
    estado:{type: String},
    montototal:{type:Number},
    entidadejecutora: {type: Schema.Types.ObjectId, ref: 'cventidades'},
    empresaejecutora: {type: Schema.Types.ObjectId, ref: 'cvempresa'},
   // desembolso: {type: String},
   // estadomonto: {type: String},
    tipo: {type: String},
    files:{type: [Schema.Types.ObjectId], ref: "cvfiles"}
    //user: {type: Schema.Types.ObjectId, ref: 'User'}
    
  },
  {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IConvenio>("cvconvenio", convenioSchema);