import mongoose, { Schema, Document, Number } from "mongoose";
export interface IProveedor extends Document {
    compania: string;
    representante: string;
    razon_social: string;
    nit: number;
    telefono: number;
    direccion: string;
    ciudad: string;
    estado: boolean
    ususario: string;
  }
  const proveedorSchema: Schema = new Schema({
    compania:{ type: String, required: true, unique: true },
    representante:{type: String, required: true, unique: true},
    razon_social: {type: String},
    nit: {type: Number},
    telefono: {type: Number},
    direccion: {type: String},
    ciudad: {type: String},
    estado: {type: Boolean},
    ususario: { type: Schema.Types.ObjectId, ref: 'User'}
  },{
    timestamps: true,
    versionKey: false,
  });
export default mongoose.model<IProveedor>("alm_proveedores", proveedorSchema);