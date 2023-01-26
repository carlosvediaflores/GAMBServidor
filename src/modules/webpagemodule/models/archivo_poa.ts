import mongoose, { Schema, Document } from "mongoose";
export interface IArchivoPoa extends Document {
  archivo: string;
  uri:string;
  path:string;
  descripcion:string
  }
  const archivoPoaSchema: Schema = new Schema({
    archivo:{type:String},
    uri:{type: String},
    path:{type: String},
    descripcion: { type: String }    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IArchivoPoa>("wpArchivoPoa", archivoPoaSchema);