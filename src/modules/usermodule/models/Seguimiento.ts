import mongoose, {  Document, Schema } from "mongoose";
import { IArchivo } from "./archivo";
export interface ISimpleSeguimiento {
    idhj?:  string;//9
    nuit?: string;//11
    destino?: string;//3
    origen?: string ;//13
    referencia?: string;//14
    origenhr?: string;//15
    detalles?: string ;//4
    recibidox?:  string;//16
    fechaderivado?: Date;//6
    fecharecepcion?: string;//7
    estado?:  string;//5
    asociado?: boolean;//3
    smsarchivo?:string;//12 
    fecharespuesta?: Date;//8
    copia?:string; //17
    oficina?:string; //18 
    nombre?:string; //19 
}
export interface ISeguimiento extends Document {
    idhj:  string;
    nuit: string;
    destino: string;
    origen: string ;
    referencia: string;
    origenhr: string;
    detalles: string ;
    recibidox:  string;
    fechaderivado: Date;
    fecharecepcion: string;
    estado:  string;
    asociado: boolean;
    smsarchivo:string;
    fecharespuesta: Date;
    copia:string;
    oficina:string; 
    nombre:string; 
    archivofi:Array<IArchivo>;//20
}
const SeguiSchema = new Schema({
    idhj: { type: String},
    nuit: { type: String},
    destino: { type: String},
    origen: { type: String },
    referencia: { type: String },
    origenhr: {type: String},
    detalles: { type: String },
    recibidox: { type: String },
    fechaderivado: { type: Date },
    fecharecepcion: { type: String },
    estado: { type: String},
    asociado:{type: Boolean},
    smsarchivo:{type:String},
    fecharespuesta:{type:Date},
    copia:{type:String},
    oficina:{type:String},
    nombre:{type:String},
    archivofi:{type: [Schema.Types.ObjectId], ref: "hrarchivo"}
},
{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);