import mongoose, { Schema, Document } from "mongoose";
export interface IReglamento extends Document {
  titulo: string;
  detalle: string;
  numero: string;
  archivo: string;
  fecha:Date;
  estado:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const reglanentoSchema: Schema = new Schema({
    titulo: {type: String},
    detalle: {type: String},
    numero: {type: String},
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
  export default mongoose.model<IReglamento>("wp_reglamento", reglanentoSchema);