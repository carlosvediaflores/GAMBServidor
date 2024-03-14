import mongoose, { Schema, Document} from "mongoose";
export interface IAutorizacion extends Document {
  numeroAutorizacion: number;
  numeroVale: number;
  fecha: Date;
  fechaSalida: Date;
  horaSalida:  Date,
  fechaLlegada: Date,
  horaLlegada:  Date,
  motivo:string;
  destino:string;
  unidadSolicitante: string;
  encargadoControl: string;
  conductor: string;
  vehiculo: string;
  productos:[];
}
const autorizationSchema: Schema = new Schema(
  {
    numeroAutorizacion: { type: Number},
    numeroVale: { type: Number},
    fecha: { type: Date, default:new Date()},
    fechaSalida: { type: Date, default:new Date()},
    horaSalida: { type: String, default:"08:00"},
    fechaLlegada: { type: Date},
    horaLlegada: { type: String,default:"18:00"},
    motivo:{type: String},
    destino:{type: String},
    unidadSolicitante: { type: Schema.Types.ObjectId, ref: "Subdirecciones" },
    encargadoControl: { type: Schema.Types.ObjectId, ref: "User" },
    conductor: { type: Schema.Types.ObjectId, ref: "User" },
    vehiculo: { type: Schema.Types.ObjectId, ref: "alm_vehiculos" },
    productos: { type: Array },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IAutorizacion>("act_autorizations", autorizationSchema);