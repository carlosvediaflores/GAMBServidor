import mongoose, {  Document, Schema } from "mongoose";
export interface ISimpleSeguimiento {
    idhj?:  string;//8
    nuit?: string;//10
    destino?: string;//3
    origen?: string ;//11
    referencia?: string;//12
    origenhr?: string;//13
    detalles?: string ;//4
    recibidox?:  string;//9
    fechaderivado?: Date;//6
    fecharecepcion?: string;//7
    estado?:  string;//5
    asociado?: boolean;//14
    smsarchivo?:string;//15
    fecharespuesta?: Date;//16
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
    fecharespuesta:{type:Date}
});
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);