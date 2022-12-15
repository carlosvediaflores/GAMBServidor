import mongoose, { Schema, Document, Decimal128 } from "mongoose";
import { IEntidad } from "./Entidad";
import { IFilescv } from "./files";
import {IFinaciadoras} from "../models/finaciadoras"
import { ITransferencia } from "./transferencia";

export interface IConvenio extends Document {
    codigo: string;
    nombre: string;
    objeto: string;
    financiadoras: Array<IFinaciadoras>;
    entidades: Array<IEntidad>;
    firma: Date;
    fechafin: Date;
    representantes: string;
    montototal:number;
    montototaltrans:number;
    saldo:any;
    plazo: any;
    estado: string;
    entidadejecutora: string;
    empresaecutota:string;
    desembolso: string;
    estadomonto: string;
    tipo: number;
    user: number;
    files: Array<IFilescv>;
    transferencia: Array<ITransferencia>
  }
  const convenioSchema: Schema = new Schema({
    codigo:{ type: String, required: true },
    nombre:{type:String},
    objeto: { type: String },
    //entidades:  [{ type: Schema.Types.ObjectId, ref: "cvfinanciadoras"}],
    financiadoras:  [{ type: Schema.Types.ObjectId, ref: "cvfinanciadoras"}],
    entidades: {type: [Schema.Types.ObjectId], ref: "cvfiles"},
    firma: {type: Date},
    fechafin: {type: Date},
    plazo: { type: Number},
    estado:{type: String, default: "REGISTRADO"},
    montototal:{type:String,default:"0"},
    montototaltrans:{type:Number},
    saldo:{type:String, default: "0"},
    entidadejecutora: {type: Schema.Types.ObjectId, ref: 'cventidades'},
    empresaejecutora: {type: Schema.Types.ObjectId, ref: 'cvempresa'},
    tipo: {type: String},
    files:{type: [Schema.Types.ObjectId], ref: "cvfiles"},
    transferencia:{type: [Schema.Types.ObjectId], ref: "cvtransferencia"},
    //user: {type: Schema.Types.ObjectId, ref: 'User'}
    
  },
  {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IConvenio>("cvconvenio", convenioSchema);