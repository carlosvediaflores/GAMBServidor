import mongoose, { Document, Schema } from "mongoose";
export interface ISubdireciones extends Document {
    
}
const SubdirSchema = new Schema({
    sigla: { type: String },
    nombresubdir: { type: String, required: true, unique: true },
    archivofi: { type: Array},
    unidad:{type: Schema.Types.ObjectId, ref: 'Organizacion'},
    user:{type: Schema.Types.ObjectId, ref: 'User'}
},
{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<ISubdireciones>("Subdirecciones", SubdirSchema);