import mongoose, {  Document, Schema } from "mongoose";
export interface ISeguimiento extends Document {

}
const SeguiSchema = new Schema({
    destino: { type: String},
    origen: { type: String },
    detalles: { type: String },
    instrucciones: { type: String },
    fechaderivado: { type: Date },
    fecharecepcion: { type: Date  },
    estado: { type: String}
});
export default mongoose.model<ISeguimiento>("seguimiento", SeguiSchema);