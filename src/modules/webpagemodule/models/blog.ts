import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleBlog {
    titulo?: string;
    subtitulo?: string;
    detalle?: string;
    slug?: string;
    estract?: string;
    contenido?:string;
    categoria?:string;
    estado?:boolean;
    uriblog?:string;
    pathblog?:string;
    createAt?: Date;
    updateAt?: Date;
  }
export interface IBlog extends Document {
    titulo: string;
    subtitulo: string;
    detalle: string;
    slug: string;
    estract: string;
    contenido:string;
    categoria:string;
    estado:boolean;
    uriblog:string;
    pathblog:string;
    createAt: Date;
    updateAt: Date;
  }
  const blogSchema: Schema = new Schema({
    titulo: {type: String},
    subtitulo: {type: String},
    detalle: {type: String},
    slug: {type: String},
    estract: {type: String},
    contenido: {type: String},
    categoria: {type: String},
    estado: {type: String},
    uriblog: {type: String},
    pathblog: {type: String},
    createAt: {type: Date},
    updateAt: {type: Date}
    
  });
  export default mongoose.model<IBlog>("wpblog", blogSchema);