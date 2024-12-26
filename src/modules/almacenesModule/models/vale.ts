import mongoose, { Schema, Document, Number } from "mongoose";
export interface IVale extends Document {
  numeroVale: number;
  fecha: Date;
  cantidad: number;
  catProgra: string;
  autorizacion: string;
  idProducto: string;
  encargadoControl: string;
  idCompra: string;
  idEgreso: string;
  motivo: string;
  destino: string;
  unidadSolicitante: string;
  conductor: string;
  vehiculo: string;
  precio: number;
  productos: [string];
  estado: string;
  cantidadAdquirida: number;
  saldoDevolucion: number;
  numAntiguo: string;
  idFacturas: [string];}
const valeSchema: Schema = new Schema(
  {
    numeroVale: { type: Number },
    fecha: { type: Date, default: new Date() },
    cantidad: { type: Number, default: 0 },
    catProgra: { type: String },
    idProducto: { type: Schema.Types.ObjectId, ref: "alm_articulos" },
    autorizacion: { type: Schema.Types.ObjectId, ref: "act_autorizations" },
    encargadoControl: { type: Schema.Types.ObjectId, ref: "User" },
    idCompra: { type: Schema.Types.ObjectId, ref: "alm_compras" },
    idEgreso: { type: Schema.Types.ObjectId, ref: "alm_egresos" },
    // Vales Salud Pacos Lublicantes y otros
    motivo: { type: String },
    destino: { type: String },
    unidadSolicitante: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
    conductor: { type: Schema.Types.ObjectId, ref: "User" },
    vehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
    productos: { type: Array },
    precio: { type: Number, default: 0 },
    estado: { type: String, default: "REGISTRADO" },
    cantidadAdquirida: { type: Number, default: 0 },
    saldoDevolucion: { type: Number, default: 0 },
    saldoDevuelto: { type: Number, default: 0 },
    numAntiguo: { type: String },
    idFacturas: [{ type: Schema.Types.ObjectId, ref: "alm_factura"}],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IVale>("alm_vale", valeSchema);
