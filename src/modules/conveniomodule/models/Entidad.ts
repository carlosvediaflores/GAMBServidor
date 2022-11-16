import mongoose, { Schema, Document } from "mongoose";

export interface IEntidad extends Document {
    nombre: string;
    representante: string;
    telefono: string;
    nit: number;
    cuenta:number
  }
  const entidadSchema: Schema = new Schema({
    nombre:{ type: String, required: true, unique: true },
    representante:{type: Schema.Types.ObjectId, ref: 'cvrepresentantes'},
    telefono: { type: String, unique: true},
    nit: {type: Number, unique: true},
    cuenta: { type: Number, required: true, unique: true},
  },{
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IEntidad>("cventidades", entidadSchema);