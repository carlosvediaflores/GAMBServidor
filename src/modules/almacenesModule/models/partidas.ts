import mongoose, { Schema, Document, Number } from "mongoose";
export interface IPartida extends Document {
  partidas: [];
}
const partidaSchema: Schema = new Schema(
  {
    partidas: {type: [Schema.Types.ObjectId], ref: "partidas"},
   
  },
  {
    versionKey: false,
  }
);
export default mongoose.model<IPartida>("alm_partidas", partidaSchema);