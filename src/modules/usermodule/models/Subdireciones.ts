import mongoose, { Document, Schema } from "mongoose";
export interface ISubdireciones extends Document {
    
}
const SubdirSchema = new Schema({
    nombredir: { type: String },
    nombresubdir: { type: String, required: true, unique: true },
    nombrecargosubdir: { type: String}
});
export default mongoose.model<ISubdireciones>("Subdirecciones", SubdirSchema);