import mongoose, { Schema, Document } from "mongoose";
export interface ISimpleCategory {
    category?: string;
    }
  export interface ICategory extends Document {
    category: string;
    }
    const caregorySchema: Schema = new Schema({
        category: {type: String},
    },
    {
      timestamps: true,
      versionKey: false,
    });
    export default mongoose.model<ICategory>("wpcategory", caregorySchema);