import mongoose, { Schema, Document } from "mongoose";
import { IPost } from "./imgpost";
export interface IBlog extends Document {
  title: string;
  subtitle: string;
  imgs:Array<IPost>;
  body: string;
  iframe: string;
  status: boolean;
  user:string;
  category:string;
  tag:string;
  }
  const blogSchema: Schema = new Schema({
    title: {type: String},
    subtitle: {type: String},
    imgs: [{ type: Schema.Types.ObjectId, ref: "wpimgposts"}],
    body: {type: String},
    iframe: {type: String},
    status: {type: Boolean, default: true},
    user:{type: String},
    category:{type: String},
    tag:{type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IBlog>("wppost", blogSchema);