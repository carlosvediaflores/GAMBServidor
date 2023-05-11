import CategoryModule, { ICategory } from "../models/category";

class BussCategory{
    constructor(){

    }
    public async readCategory(): Promise<Array<ICategory>>;
    public async readCategory(id: string): Promise<ICategory>;
    public async readCategory(query: any, skip: number, limit: number): Promise<Array<ICategory>>;

    public async readCategory(params1?: string | any, params2?: number, params3?: number): Promise<Array<ICategory> | ICategory> {
        if (params1 && typeof params1 == "string") {
            var result: ICategory = await CategoryModule.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listCategory: Array<ICategory> = await CategoryModule.find(params1).skip(skip).limit(limit);
            return listCategory;
        } else {
            let listBlog: Array<ICategory> = await CategoryModule.find();
            return listBlog;
        }
    }  
    public async addCategory(category: ICategory) {
        try {
            let categoryDb = new CategoryModule(category);
            let result = await categoryDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
    public async updateCategory(id: string, blog: any) {
        let result = await CategoryModule.updateOne({ _id: id }, { $set: blog });
        return result;
    }
    public async deleteCategory(id: string) {
        let result = await CategoryModule.remove({ _id: id });
        return result;
    }
}
export default BussCategory;