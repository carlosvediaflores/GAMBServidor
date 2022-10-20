import mongoose, { Schema, Document } from "mongoose";
export interface ISimpleRepresentante {
    nombre?: string;
    apellidos?: string;
    cargo?: string;
    telefono?: string;
    ci?: string;
    email?: string;
    urirepres?: string;
    pathrepres?: string;
    entidad?: string
  }
export interface IRepresentante extends Document {
    nombre: string;
    apellidos: string;
    cargo: string;
    telefono: string;
    ci: string;
    email: string;
    urirepres: string;
    pathrepres: string;
    entidad: string
  }
  const represSchema: Schema = new Schema({
    nombre:{ type: String, requiered: true },
    apellidos: { type: String, requiered: true },
    cargo: { type: String, requiered: true},
    telefono: {type: String},
    ci: {type: String, unique: true},
    email: { type: String, unique: true},
    urirepres: { type: String},
    pathrepres: { type: String},
    entidad: {  type: Schema.Types.ObjectId,
      ref: 'cventidades'}
    
  }, {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IRepresentante>("cvrepresentantes", represSchema);