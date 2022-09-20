import mongoose, { Schema, Document } from "mongoose";
import paginate from 'mongoose-paginate-v2';
//import  {  mongoosePagination ,  Pagination  }  from  "mongoose-paginate-ts" ;
import RolesModel, { IRoles } from "./Roles";

export interface ISimpleUser {
  username?: string;
  surnames?: string;
  ci?: string;
  numberphone?: number;
  email?: string;
  birthdate?: Date;
  registerdate?: Date;
  password?: string;
  post?: string;
  roles?: string;
  uriavatar?: string;
  pathavatar?: string;
}
export interface IUser extends Document {
  username: string;
  surnames: string;
  ci: string;
  numberphone: number;
  email: string;
  birthdate: Date;
  registerdate: Date;
  password: string;
  post: string;
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
  birthdate: { type: Date },
  registerdate: { type: Date, required: true },
  password: { type: String, required: true },
  post: { type: String },
  roles: { type: String },
  uriavatar: { type: String },
  pathavatar: { type: String },
});
userSchema.plugin(paginate);
const model = mongoose.model<IUser, mongoose.PaginateModel<IUser>>('User', userSchema, 'users');
export default model;
