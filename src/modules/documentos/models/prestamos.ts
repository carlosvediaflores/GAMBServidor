import mongoose, { Schema, Document, Number } from "mongoose";

export interface IPrestamos extends Document {
  numero: string;
  monto: number;
  interes: number;
  saldoA:number;
  tipo: string;
  nombre: string;
  fechaFirma: Date;
  fechaFin: Date;
  estado: boolean;
  amortizacion:[];
  archivos: [];
  idUsuario: string;
}
const prestamoSchema: Schema = new Schema(
  {
    numero: { type: String, unique: true },
    monto: { type: Number, default:0 },
    interes: { type: Number, default:0  },
    saldoA:{type: Number, default:0 },
    tipo: { type: String },
    nombre: { type: String},
    fechaFirma: { type: Date, default: new Date() },
    fechaFin: { type: Date },
    estado: { type: Boolean, default: true },
    amortizacion:[{ type: Schema.Types.ObjectId, ref: "doc_amortizacions" }],
    archivos:[{ type: Schema.Types.ObjectId, ref: "doc_fileprestamos" }],
    idUsuario: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IPrestamos>("doc_prestamos", prestamoSchema);
