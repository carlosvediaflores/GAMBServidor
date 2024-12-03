import mongoose, { Schema, Document } from "mongoose";
import RolesModel, { IRoles } from "./Roles";
import { ISubdireciones } from "./Subdireciones";
export interface IUser extends Document {
  username: string;
  surnames: string;
  ci: string;
  categoriaLicencia:string;
  numberphone: number;
  email: string;
  birthday: Date;
  registerdate: Date;
  password: string;
  cargo: Array<ISubdireciones>
  post: string;
  isActive:boolean;
  roles: string;
  uriavatar: string;
  pathavatar: string;
  dependencia:string;
}
const userSchema: Schema = new Schema({
  username: { type: String },
  surnames: { type: String },
  ci: { type: String, required: true, unique: true },
  categoriaLicencia: { type: String },
  numberphone: { type: Number },
  email: { type: String, required: true, unique: true },
  birthday: { type: Date },
  registerdate: { type: Date},
  password: { type: String, required: true },
  cargo: {type: Schema.Types.ObjectId, ref: 'Subdirecciones'},
  dependencia: {type: Schema.Types.ObjectId, ref: 'corr_dependencias'},
  post: { type: String },
  isActive:{type:Boolean, default:true},
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
