import mongoose, { Schema, Document, Number } from "mongoose";
export interface IProveedor extends Document {
    razon_social: string;
    representante: string;
    direccion: string;
    nit: string;
    telefono: string;
    ciudad: string;
    estado: boolean
    ususario: string;
  }
  const proveedorSchema: Schema = new Schema({
    razon_social: {type: String, default:null},
    representante:{type: String, default:null},
    direccion: {type: String, default:null},
    nit: {type: String, default:null},
    telefono: {type: String, default:null},
    ciudad: {type: String, default:null},
    estado: {type: Boolean, default:true},
    idUsuario: { type: Schema.Types.ObjectId, ref: 'User'}
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<IProveedor>("alm_proveedores", proveedorSchema);