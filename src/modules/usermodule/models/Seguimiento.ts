import mongoose, {  Document, Schema } from "mongoose";
export interface ISimpleSeguimiento {
    idhj?:  string;
    nuit?: string;
    destino?: string;
    origen?: string ;
    detalles?: string ;
    instrucciones?:  string;
    fechaderivado?: Date;
    fecharecepcion?: string;
    estado?:  string;
}
export interface ISeguimiento extends Document {
    idhj:  string;
    nuit: string;
    destino: string;
    origen: string ;
    detalles: string ;
    instrucciones:  string;
    fechaderivado: Date;
    fecharecepcion: string;
    estado:  string;
}
const SeguiSchema = new Schema({
    idhj: { type: String},
    nuit: { type: String},
    destino: { type: String},
    origen: { type: String },
    detalles: { type: String },
    instrucciones: { type: String },
    fechaderivado: { type: Date },
    fecharecepcion: { type: String },
    estado: { type: String}
});
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);