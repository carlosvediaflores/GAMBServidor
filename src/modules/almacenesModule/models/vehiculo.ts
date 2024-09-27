import mongoose, { Schema, Document, Number } from "mongoose";

export interface IVehiculo extends Document {
  codigoDejurbe:string;
  codigoVsiaf: string;
  tipo:string;
  marca: string
  placa: string;
  numMotor:string;
  numChasis:string;
  destino:string;
  estado:string;
  color: string;
  propietario:string;
  observacion:string;
  idChofer:string;
}
const vehiculoSchema: Schema = new Schema(
  {
    codigoDejurbe: { type: String },
    codigoVsiaf: { type: String},
    tipo: { type: String},
    marca:{type: String},
    placa: {type:String},
    numMotor: { type: String },
    numChasis: { type: String},
    destino:{type: String},
    estado: {type:String, default:"ACTIVO"},
    color: { type:String},
    propietario:{type:String},
    observacion:{type:String},
    idChofer: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model<IVehiculo>("alm_vehiculos", vehiculoSchema);
