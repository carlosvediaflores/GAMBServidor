import BlogModule, { IBlog } from "../models/blog";
import imgpostModule, {IPost} from "../models/imgpost";

class BussBlog{
    constructor(){

    }
    public async readBlog(): Promise<Array<IBlog>>;
    public async readBlog(slug: string): Promise<IBlog>;
    public async readBlog(query: any, skip: number, limit: number, order:any): Promise<Array<IBlog>>;

    public async readBlog(params1?: string | any, params2?: number, params3?: number, order?: any): Promise<Array<IBlog> | IBlog> {
        if (params1 && typeof params1 == "string") {
            var result: IBlog = await BlogModule.findOne({ slug: params1 }).populate("imgs").populate("user");
            return result;
        } else if (params1) {
            let skip = params2;
            let limit = params3;
            let listBlog: Array<IBlog> = await BlogModule.find(params1).skip(skip).limit(limit).sort(order).populate("imgs").populate("user");
            return listBlog;
        } else {
            let listBlog: Array<IBlog> = await BlogModule.find().populate("imgs").populate("user");
            return listBlog;
        }
    }  
    public async total({}) {
        var result = await BlogModule.countDocuments();
        return result;
      }
    public async readPost(img: string): Promise<IBlog>;
    public async readPost(params1?: string | any, params2?: number, params3?: number): Promise<Array<IBlog> | IBlog> {
        if (params1 && typeof params1 == "string") {
            var result: IBlog = await BlogModule.findOne({ img: params1 });
            return result;
        }
    }
    public async readPostId(id: string): Promise<IBlog>;
    public async readPostId(params1?: string | any, params2?: number, params3?: number): Promise<Array<IBlog> | IBlog> {
        if (params1 && typeof params1 == "string") {
            var result: IBlog = await BlogModule.findOne({ _id: params1 }).populate("imgs").populate("user");
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
        let result = await BlogModule.updateOne({ _id: id }, { $set: blog });
        return result;
    }
    public async deleteBlog(id: string) {
        let result = await BlogModule.deleteOne({ _id: id });
        return result;
    }
    public async addImgs(idcv: string, idFile: string) {
        let imgpost = await BlogModule.findOne({ _id: idcv });
        if (imgpost != null) {
          var fil = await imgpostModule.findOne({ _id: idFile });
          if (fil != null) {
            var checkrol: Array<IPost> = imgpost.imgs.filter((item) => {
              if (fil._id.toString() == item._id.toString()) {
                return true;
              }
              return false;
            });
            if (checkrol.length == 0) {
              imgpost.imgs.push(fil);
              return await imgpost.save();
            }
            return null;
          }
          return null;
        }
        return null;
      }
}
export default BussBlog;