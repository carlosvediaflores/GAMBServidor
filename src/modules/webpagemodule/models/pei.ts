import mongoose, { Schema, Document } from "mongoose";
export interface IPei extends Document {
  gestion: string;
  titulo: string;
  descripcion: string;
  //ley: string;
  archivo: string;
  fecha:Date;
  estado:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const peiSchema: Schema = new Schema({
    gestion: { type: String },
    titulo: {type: String},
    descripcion: {type: String},
    //ley:{type: Schema.Types.ObjectId, ref: 'wpgaceta'},
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
  export default mongoose.model<IPei>("wp_pei", peiSchema);