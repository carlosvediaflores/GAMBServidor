import mongoose, { Schema, Document } from "mongoose";
export interface ISimpleCategory {
    category?: string;
    }
  export interface ICategory extends Document {
    category: string;
    }
    const caregorySchema: Schema = new Schema({
        category: {type: String},
    });
    export default mongoose.model<ICategory>("wpcategory", caregorySchema);