import mongoose, { Schema, Document } from "mongoose";
import { IRepresentante } from "./Representante";

export interface IEntidad extends Document {
    denominacion: string;
    codigo: string;
    sigla:string;
    representante: Array<IRepresentante>;
    telefono: string;
    nit: number;
    cuenta:number
  }
  const entidadSchema: Schema = new Schema({
    denominacion:{ type: String, required: true, unique: true },
    sigla:{type:String},
    codigo:{type:String},
    representante:{type: [Schema.Types.ObjectId], ref: "cvrepresentantes"},
    telefono: { type: String, unique: true},
    nit: {type: Number, unique: true},
    cuenta: { type: Number, unique: true},
  },{
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IEntidad>("cventidades", entidadSchema);