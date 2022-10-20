import mongoose, { Schema, Document, Decimal128 } from "mongoose";

export interface ISimpleSlaider {
    titulo?: string;
    img?: string;
    detalle?: string;
    estado?:string;
    urislaider?: string;
    patsslaider?: string;
    createAt?: Date;
    updateAt?: Date;
  }
export interface ISlaider extends Document {
    //_id:string;
    titulo: string;
    img: string;
    detalle: string;
    estado:string;
    urislaider: string;
    patsslaider: string;
    createAt: Date;
    updateAt: Date;
  }
  const slaiderSchema: Schema = new Schema({
    //_id:{type:String},
    titulo: {type: String},
    img: {type: String},
    detalle: {type: String},
    estado:{type: String, default:"true"},
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