import mongoose, { Schema, Document } from "mongoose";
import { IRepresentante } from "./Representante";

export interface IEntidad extends Document {
    denominacion: string;
    codigo: number;
    sigla:string;
    representante: Array<IRepresentante>;
    telefono: string;
    nit: number;
    cuenta:number
  }
  const entidadSchema: Schema = new Schema({
    denominacion:{ type: String, unique: true},
    sigla:{type:String, unique: true},
    codigo:{type:Number, unique: true},
    representante:{type: [Schema.Types.ObjectId], ref: "cvrepresentantes"},
    telefono: { type: String},
    nit: {type: Number},
    cuenta: { type: Number},
  },{
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IEntidad>("cventidades", entidadSchema);