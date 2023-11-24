import mongoose, { Schema, Document } from "mongoose";
export interface IPtdi extends Document {
  gestion: string;
  titulo: string;
  descripcion: string;
  ley: string;
  archivo: string;
  fecha:Date;
  estado:boolean;
  publico:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const ptdiSchema: Schema = new Schema({
    gestion: { type: String },
    titulo: {type: String},
    descripcion: {type: String},
    ley:{type: Schema.Types.ObjectId, ref: 'wpgaceta'},
    archivo:{type:String},
    fecha:{type:Date},
    estado:{type:Boolean, default:false},
    publico:{type:Boolean, default:false},
    uri:{type: String},
    path:{type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IPtdi>("wpptdi", ptdiSchema);