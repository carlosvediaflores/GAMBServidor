import mongoose, { Schema, Document, Number } from "mongoose";

export interface IAmortizacion extends Document {
  periodo: string;
  monto: number;
  interes: number;
  fechaPago: Date;
  estado: boolean;
  fuente:string;
  uri: string;
  path: string;
  nameFile: string;
  prestamo:[];
  idUsuario: string;
}
const amortizacionSchema: Schema = new Schema(
  {
    periodo: { type:String},
    monto: { type: Number, default:0 },
    interes: { type: Number, default:0  },
    fechaPago: { type: Date, default: new Date() },
    estado: { type: Boolean, default: true },
    fuente: { type: String},
    uri: { type: String },
    path: { type: String },
    nameFile: { type: String },
    prestamo:[{ type: Schema.Types.ObjectId, ref: "doc_prestamos" }],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IAmortizacion>("doc_amortizacions", amortizacionSchema);
