import mongoose, { Schema, Document } from "mongoose";
export interface ITransferencia extends Document {
  idcv:string;
  entidad:string
  fecha: Date;
  fuente: string;
  cuenta: string;
  importe: number;
  total: number;
  saldo: number;
  totaldes:number;
  uriconpro: string;
  pathcompro: string;
  namefile: string,
}
const desSchema: Schema = new Schema(
  {
    idcv:{ type: Schema.Types.ObjectId, ref: 'cvconvenio'},
    entidad: { type: String, required: true },
    fecha: { type: Date},
    fuente: { type: String},
    cuenta: { type: String},
    importe: { type: Number},
    total: { type: Number},
    saldo: { type: Number},
    totaldes: { type: Number},
    uricompro: { type: String },
    pathcompro: { type: String },
    namefile: { type: String}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ITransferencia>("cvtransferencia", desSchema);
