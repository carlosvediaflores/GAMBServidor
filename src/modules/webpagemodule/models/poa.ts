import mongoose, { Schema, Document } from "mongoose";
import { IArchivoPoa } from "./archivo_poa";
export interface IPoa extends Document {
  gestion: number;
  titulo: string;
  descripcion: string;
  ley: string;
  archivo: Array<IArchivoPoa>;
  estado:boolean;
  usuario:string
  }
  const poaSchema: Schema = new Schema({
    gestion:{type:Number},
    titulo: {type: String},
    descripcion: {type: String},
    ley:{type: Schema.Types.ObjectId, ref: 'wpgaceta'},
    archivo:[{ type: Schema.Types.ObjectId, ref: "wpArchivoPoa"}],
    estado:{type:Boolean, default:false},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IPoa>("wppoa", poaSchema);