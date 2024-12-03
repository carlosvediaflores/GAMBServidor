import mongoose, { Schema, Document, Number } from "mongoose";

export interface ICorrespondencia extends Document {
  gestion: string;
  lugar: string;
  fecha: Date;
  numCite: number;
  nombreDestino: string;
  cargoDestino:string;
  entidadDestino:string;
  lugarDestino:string;
  via:string;
  genero:string;
  referencia:string;
  hojaRuta:string;
  fsAdjunto:string;
  idTipo: string;
  fileName:string;
  idSubTipo:string;
  idDependencia: string;
  idUsuario: string;
  isUpdated:boolean;
  isActive:boolean;
}
const correspondenciaSchema: Schema = new Schema(
  {
    gestion: { type: String, required:true },
    lugar: { type: String, default:"Betanzos" },
    fecha:{ type: Date, default:new Date()},
    numCite: { type: Number, required:true, default:1},
    nombreDestino: { type: String },
    cargoDestino:{type:String},
    entidadDestino:{type:String},
    lugarDestino:{type:String, default:"Presente"},
    via:{type: Schema.Types.ObjectId, ref: "User"},
    genero:{type:String, default:'Señor'},
    referencia:{type:String},
    hojaRuta:{type:String},
    fsAdjunto:{type:String, default:1},
    fileName:{type:String},
    idTipo: { type: Schema.Types.ObjectId, ref: "corr_Tipo" },
    idSubTipo:{ type: Schema.Types.ObjectId, ref: "corr_subTipo"},
    idDependencia: { type: Schema.Types.ObjectId, ref: "corr_dependencias"},
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
    isUpdated:{type:Boolean, default:false},
    isActive:{type:Boolean, default:true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICorrespondencia>("corr_cites", correspondenciaSchema);
