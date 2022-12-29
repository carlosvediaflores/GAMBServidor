import mongoose, { Schema, Document } from "mongoose";
export interface IPoa extends Document {
  titulo: string;
  detalle: string;
  ley: string;
  archivo: string;
  fecha:Date;
  estado:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const poaSchema: Schema = new Schema({
    titulo: {type: String},
    detalle: {type: String},
    ley:{type: Schema.Types.ObjectId, ref: 'wpgaceta'},
    archivo:{type:String},
    fecha:{type:Date},
    estado:{type:Boolean, default:false},
    uri:{type: String},
    path:{type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IPoa>("wppoa", poaSchema);