import mongoose, { Schema, Document } from "mongoose";
export interface IPost extends Document {
  archivo: string;
  uri:string;
  path:string;
  }
  const imgpstSchema: Schema = new Schema({
    archivo:{type:String},
    uri:{type: String},
    path:{type: String},    
  },
  {
    timestamps: true,
    versionKey: false,
  });
  export default mongoose.model<IPost>("wpimgposts", imgpstSchema);