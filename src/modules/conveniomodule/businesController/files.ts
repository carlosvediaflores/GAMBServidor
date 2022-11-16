import filesModule,{IFilescv} from "../models/files";

class BussFiles{
    constructor(){

    }
    public async readFile(): Promise<Array<IFilescv>>;
    public async readFile(id: string): Promise<IFilescv>;
    public async readFile(query: any, skip: number, limit: number): Promise<Array<IFilescv>>;

    public async readFile(params1?: string | any, params2?: number, params3?: number): Promise<Array<IFilescv> | IFilescv> {
        if (params1 && typeof params1 == "string") {
            var result: IFilescv = await filesModule.findOne({ _id: params1 });
            return result;
        } else if (params1) {
            let skip = params2 ? params2 : 0;
            let limit = params3 ? params3 : 1;
            let listFiles: Array<IFilescv> = await filesModule.find(params1).skip(skip).limit(limit);
            return listFiles;
        } else {
            let listFiles: Array<IFilescv> = await filesModule.find();
            return listFiles;
        }
    }
    public async readcv(namefile: string): Promise<IFilescv>;
    public async readcv(params1?: string | any, params2?: number, params3?: number): Promise<Array<IFilescv> | IFilescv> {
        if (params1 && typeof params1 == "string") {
            var result: IFilescv = await filesModule.findOne({ namefile: params1 });
            return result;
        }
    } 
    public async addFilecv(filecv: IFilescv) {
        try {
            let fileDb = new filesModule(filecv);
            let result = await fileDb.save();
            return result;
        } catch (err) {
            return err;
        }
    }
}
export default BussFiles;