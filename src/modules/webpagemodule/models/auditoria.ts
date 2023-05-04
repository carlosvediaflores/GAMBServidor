import mongoose, { Schema, Document } from "mongoose";
export interface IAuditoria extends Document {
  gestion: string;
  tipo: string;
  resumen: string;
  archivo: string;
  fecha:Date;
  estado:boolean;
  uri:string;
  path:string;
  usuario:string
  }
  const auditoriaSchema: Schema = new Schema({
    gestion: { type: String },
    tipo: {type:String},
    resumen: {type: String},
    archivo:{type:String},
    fecha:{type:Date, default: Date.now},
    estado:{type:Boolean, default:false},
    uri:{type: String},
    path:{type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IAuditoria>("wp_auditoria", auditoriaSchema);