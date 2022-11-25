import mongoose, { Schema, Document, Decimal128 } from "mongoose";
export interface ISlaider extends Document {
    titulo: string;
    img: string;
    detalle: string;
    estado:boolean;
    user:string;
    urislaider: string;
    patsslaider: string;
    createAt: Date;
    updateAt: Date;
  }
  const slaiderSchema: Schema = new Schema({
    titulo: {type: String},
    img: {type: String},
    detalle: {type: String},
    estado:{type: Boolean, default: true},
    user:{type: String},
    urislaider:{type: String},
    patsslaider: {type: String},
    createAt:{type: Date},
    updateAt:{type: Date}
    
  },
  {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<ISlaider>("wpslaider", slaiderSchema);