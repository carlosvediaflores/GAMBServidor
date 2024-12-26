import mongoose, { Schema, Document, Number } from "mongoose";
export interface IFactura extends Document {
  numeroFactura: number;
  fechaFactura: Date;
  montoFactura: number;
  cantidadFactura: number;
  idProveedor: string;
  idVale: string;
  
}
const facturaSchema: Schema = new Schema(
  {
    numeroFactura: { type: Number },
    fechaFactura: { type: Date, default: new Date() },
    montoFactura: { type: Number, default: 0 },
    cantidadFactura: { type: Number, default: 0 },
    idProveedor: { type: Schema.Types.ObjectId, ref: "alm_proveedores" },
    idVale: { type: Schema.Types.ObjectId, ref: "alm_vale" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IFactura>("alm_factura", facturaSchema);
