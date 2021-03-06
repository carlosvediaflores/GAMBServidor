import mongoose, {  Document, Schema } from "mongoose";
export interface ISimpleSeguimiento {
    idhj?:  string;
    nuit?: string;
    destino?: string;
    origen?: string ;
    referencia?: string;
    origenhr?: string;
    detalles?: string ;
    instrucciones?:  string;
    fechaderivado?: Date;
    fecharecepcion?: string;
    estado?:  string;
    asociado?: boolean;
}
export interface ISeguimiento extends Document {
    idhj:  string;
    nuit: string;
    destino: string;
    origen: string ;
    referencia: string;
    origenhr: string;
    detalles: string ;
    instrucciones:  string;
    fechaderivado: Date;
    fecharecepcion: string;
    estado:  string;
    asociado?: boolean;
}
const SeguiSchema = new Schema({
    idhj: { type: String},
    nuit: { type: String},
    destino: { type: String},
    origen: { type: String },
    referencia: { type: String },
    origenhr: {type: String},
    detalles: { type: String },
    instrucciones: { type: String },
    fechaderivado: { type: Date },
    fecharecepcion: { type: String },
    estado: { type: String},
    asociado:{type: Boolean}
});
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);