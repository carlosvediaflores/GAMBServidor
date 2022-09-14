import BlogModule, { IBlog } from "../models/blog";

class BussBlog{
    constructor(){

    }
    public async readBlog(): Promise<Array<IBlog>>;
    public async readBlog(id: string): Promise<IBlog>;
    public async readBlog(query: any, skip: number, limit: number): Promise<Array<IBlog>>;

    public async readBlog(params1?: string | any, params2?: number, params3?: number): Promise<Array<IBlog> | IBlog> {
        if (params1 && typeof params1 == "string") {
            var result: IBlog = await BlogModule.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listBlog: Array<IBlog> = await BlogModule.find(params1).skip(skip).limit(limit);
            return listBlog;
        } else {
            let listBlog: Array<IBlog> = await BlogModule.find();
            return listBlog;
        }
    }  
    public async readUser(post: string): Promise<IBlog>;
    public async readUser(params1?: string | any, params2?: number, params3?: number): Promise<Array<IBlog> | IBlog> {
        if (params1 && typeof params1 == "string") {
            var result: IBlog = await BlogModule.findOne({ post: params1 });
            return result;
        }
    } 
    public async addBlog(blog: IBlog) {
        try {
            let blogDb = new BlogModule(blog);
            let result = await blogDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateBlog(id: string, blog: any) {
        let result = await BlogModule.update({ _id: id }, { $set: blog });
        return result;
    }
    public async deleteBlog(id: string) {
        let result = await BlogModule.remove({ _id: id });
        return result;
    }
}
export default BussBlog;