import mongoose, {  Document, Schema } from "mongoose";
export interface IFilescv extends Document {
    idcv:  string;
    uriconvenio: string;
    patconvenio: string;
    namefile: string;
    typefile: string;
}
const FileSchema = new Schema({
    idcv: { type: Schema.Types.ObjectId, ref: 'cvconvenio'},
    uriconvenio: { type: String},
    patconvenio: { type: String},
    namefile: { type: String},
    typefile: { type: String }
},{
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IFilescv>("cvfiles", FileSchema);