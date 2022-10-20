import mongoose, {  Document, Schema } from "mongoose";
export interface ISimpleFiles{
    idhj:  string;
    urihoja?: string;
    pathhoja?: string;
    namefile?: string;
}
export interface IFiles extends Document {
    idhj:  string;
    urihoja: string;
    pathhoja: string;
    namefile: string;
}
const FileSchema = new Schema({
    idhj: { type: String},
    urihoja: { type: String},
    pathhoja: { type: String},
    namefile: { type: String }
},{
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IFiles>("files", FileSchema);