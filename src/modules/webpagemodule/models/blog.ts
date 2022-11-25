import mongoose, { Schema, Document } from "mongoose";
export interface IBlog extends Document {
  title: string;
  subtitle: string;
  img: string;
  body: string;
  iframe: string;
  status: boolean;
  user:string;
  category:string;
  tag:string;
  uri:string;
  path:string;
  }
  const blogSchema: Schema = new Schema({
    title: {type: String},
    subtitle: {type: String},
    img:{type:String},
    body: {type: String},
    iframe: {type: String},
    status: {type: Boolean, default: true},
    user:{type: String},
    category:{type: String},
    tag:{type: String},
    uri:{type: String},
    path:{type: String}    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IBlog>("wppost", blogSchema);