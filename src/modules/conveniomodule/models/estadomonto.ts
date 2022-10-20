import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleEstmonto {
    total: number;
    saldo: number;
    totaltrans: number;
  }
export interface IEstmonto extends Document {
    total: number;
    saldo: number;
    totaltrans: number;
  }
  const estmontoSchema: Schema = new Schema({
    total: { type: Number},
    saldo: { type: Number},
    totaltrans: { type: Number}
    
  }, {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model<IEstmonto>("cvestadomonto", estmontoSchema);