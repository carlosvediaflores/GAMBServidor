import mongoose, {  Document, Schema } from "mongoose";
export interface ISimpleSeguimiento {
    idhj?:  string;//10
    nuit?: string;//12
    destino?: string;//4
    origen?: string ;//16
    referencia?: string;//13
    origenhr?: string;//14
    detalles?: string ;//5
    recibidox?:  string;//20
    fechaderivado?: Date;//7
    fecharecepcion?: string;//8
    estado?:  string;//6
    asociado?: boolean;//3
    smsarchivo?:string;//13
    fecharespuesta?: Date;//9
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
    nombre:{type:String}
},
{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);