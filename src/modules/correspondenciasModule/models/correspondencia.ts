import mongoose, { Schema, Document, Number } from "mongoose";

export interface ICorrespondencia extends Document {
  gestion: string;
  lugar: string;
  fecha: Date;
  numCite: number;
  nombreDestino: string;
  cargoDestino:string;
  lugarDestino:string;
  via:string;
  referencia:string;
  hojaRuta:string;
  fsAdjunto:string;
  idTipo: string;
  idSubTipo:string;
  idDependencia: string;
  idUsuario: string;
}
const correspondenciaSchema: Schema = new Schema(
  {
    gestion: { type: String, required:true },
    lugar: { type: String, default:"Betanzos" },
    fecha:{ type: Date, default:new Date()},
    numCite: { type: Number, required:true, default:1},
    nombreDestino: { type: String },
    cargoDestino:{type:String},
    lugarDestino:{type:String, default:"Presente"},
    via:{type:String},
    referencia:{type:String},
    hojaRuta:{type:String},
    fsAdjunto:{type:String},
    idTipo: { type: Schema.Types.ObjectId, ref: "corr_Tipo" },
    idSubTipo:{ type: Schema.Types.ObjectId, ref: "corr_subTipo"},
    idDependencia: { type: Schema.Types.ObjectId, ref: "corr_dependencias"},
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<ICorrespondencia>("corr_cites", correspondenciaSchema);
