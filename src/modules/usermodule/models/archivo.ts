import mongoose, {  Document, Schema } from "mongoose";
export interface IArchivo extends Document {
    destino:  string;
    description: string;
    status:string;
}
const FileSchema = new Schema({
    destino: { type: String},
    description: { type: String},
    status:{type:String}
},{
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IArchivo>("hrarchivo", FileSchema);