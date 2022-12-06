import mongoose, {  Document, Schema } from "mongoose";
export interface IFinaciadoras extends Document {
    idcv:  string;
    tipo: string;
    monto: number;
    entidad: string
}
const FileSchema = new Schema({
    idcv: { type: Schema.Types.ObjectId, ref: 'cvconvenio'},
    tipo: { type: String},
    monto: { type: Number},
    entidad: { type: Schema.Types.ObjectId, ref: 'cvendidades'},
},{
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IFinaciadoras>("cvfinanciadoras", FileSchema);