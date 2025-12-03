import mongoose, {  Document, Schema } from "mongoose";
export interface IFinaciadoras extends Document {
    idcv:  string;
    tipo: string;
    monto: string;
    entidad: string
}
const FileSchema = new Schema({
    idcv: { type: Schema.Types.ObjectId, ref: 'cvconvenio'},
    tipo: { type: String},
    monto: { type: String},
    entidad: { type: Schema.Types.ObjectId, ref: 'entities'},
},{
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IFinaciadoras>("cvfinanciadoras", FileSchema);