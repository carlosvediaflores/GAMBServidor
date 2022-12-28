import mongoose, { Schema, Document } from "mongoose";
import { IPost } from "./imgpost";
export interface IBlog extends Document {
  title: string;
  subtitle: string;
  imgs:Array<IPost>;
  body: string;
  iframe: string;
  status: boolean;
  fecha:Date;
  user:string;
  category:string;
  slug: string;
  tag:string;
  }
  const blogSchema: Schema = new Schema({
    title: {type: String},
    subtitle: {type: String},
    imgs: [{ type: Schema.Types.ObjectId, ref: "wpimgposts"}],
    body: {type: String},
    iframe: {type: String, default:null},
    status: {type: Boolean, default: true},
    fecha:{type:Date},
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    category:{type: String},
    slug:{type:String},
    tag:{type: String},
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IBlog>("wppost", blogSchema);