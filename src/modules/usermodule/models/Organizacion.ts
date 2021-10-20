import mongoose, { Schema, Document } from "mongoose";
import SubdireccionModel, { ISubdireciones } from "./Subdireciones";
export interface ISimpleOrganizacion {
  nombredir?: string;
  nombrecargo?: string;
  subdirecciones?: Array<ISubdireciones>;
}
export interface IOrganizacion extends Document {
    Array: any;
    nombredir: string;
    nombrecargo: string;
    subdirecciones: Array<ISubdireciones>;
  }
  const orgSchema: Schema = new Schema({
    nombredir: { type: String},
    nombrecargo: { type: String },
    subdirecciones: { type: Array },
  });
export default mongoose.model<IOrganizacion>("Organizacion", orgSchema);