import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleEntidad {
    text?: string;
    representante?: string;
    telefono?: string;
    nit?: number;
    email?: string;
    cuenta?:number
  }
export interface IEntidad extends Document {
    text: string;
    representante: string;
    telefono: string;
    nit: number;
    cuenta:number
  }
  const entidadSchema: Schema = new Schema({
    text:{ type: String, required: true, unique: true },
    representante:{type: Schema.Types.ObjectId, ref: 'cvrepresentantes',required: true},
    telefono: { type: String, unique: true},
    nit: {type: Number, unique: true},
    cuenta: { type: Number, required: true, unique: true},
  },{
    timestamps: true,
    versionKey: false,
  });
  entidadSchema.method('toJSON', function() {
    const { __v, _id,  ...object } = this.toObject();
    object.id = _id;
    //object.text = nombre;
    return object;
})

export default mongoose.model<IEntidad>("cventidades", entidadSchema);