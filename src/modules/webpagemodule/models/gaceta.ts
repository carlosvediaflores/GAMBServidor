import mongoose, { Schema, Document } from "mongoose";
export interface IGaceta extends Document {
  titulo: string;
  detalle: string;
  numero: number;
  archivo: string;
  estado:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const blogSchema: Schema = new Schema({
    titulo: {type: String},
    detalle: {type: String},
    numero: {type: Number},
    archivo:{type:String},
    estado:{type:Boolean, default:false},
    uri:{type: String},
    path:{type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IGaceta>("wpgaceta", blogSchema);