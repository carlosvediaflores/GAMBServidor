import mongoose, { Schema, Document} from "mongoose";
export interface IAutorizacion extends Document {
  numeroAutorizacion: number;
  numeroVale: number;
  fecha: Date;
  fechaSalida: Date;
  motivo:string;
  destino:string;
  unidadSolicitante: string;
  encargadoControl: string;
  conductor: string;
  vehiculo: string;
}
const autorizationSchema: Schema = new Schema(
  {
    numeroAutorizacion: { type: Number},
    numeroVale: { type: Number},
    fecha: { type: Date, default:new Date()},
    fechaSalida: { type: Date, default:new Date()},
    motivo:{type: String},
    destino:{type: String},
    unidadSolicitante: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
    encargadoControl: { type: Schema.Types.ObjectId, ref: "User" },
    conductor: { type: Schema.Types.ObjectId, ref: "User" },
    vehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IAutorizacion>("act_autorizations", autorizationSchema);