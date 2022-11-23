import mongoose, { Document, Schema } from "mongoose";
export interface ISubdireciones extends Document {
    
}
const SubdirSchema = new Schema({
    sigla: { type: String },
    nombresubdir: { type: String, required: true, unique: true },
    archivofi: { type: Array}
},
{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ISubdireciones>("Subdirecciones", SubdirSchema);