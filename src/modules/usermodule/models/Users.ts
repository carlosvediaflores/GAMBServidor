import mongoose, { Schema, Document } from "mongoose";
import RolesModel, { IRoles } from "./Roles";
import { ISubdireciones } from "./Subdireciones";
export interface IUser extends Document {
  username: string;
  surnames: string;
  ci: string;
  numberphone: number;
  email: string;
  birthday: Date;
  registerdate: Date;
  password: string;
  cargo: Array<ISubdireciones>
  post: string;
  beneficiarioPago: string;
  isActive:boolean;
  roles: string;
  uriavatar: string;
  pathavatar: string;
}
const userSchema: Schema = new Schema({
  username: { type: String },
  surnames: { type: String },
  ci: { type: String },
  numberphone: { type: Number },
  email: { type: String, required: true, unique: true },
  birthday: { type: Date },
  registerdate: { type: Date, required: true },
  password: { type: String, required: true },
  cargo: {type: Schema.Types.ObjectId, ref: 'Subdirecciones'},
  post: { type: String },
  beneficiarioPago: { type: String },
  isActive:{type:Boolean},
  roles: { type: String, default: "SUPER_USER" },
  uriavatar: { type: String },
  pathavatar: { type: String },
},
{
  timestamps: true,
  versionKey: false,
});
const model = mongoose.model<IUser>('User', userSchema);
export default model;
