import { Box } from "@layer92/core";
import { Expect } from "@layer92/core";


export class FolderNameBox extends Box<String>{
    private FolderNameBox:undefined;

    constructor(
        data:string
    ){
        Expect(data.length,"data: cannot be empty.");
        Expect(!data.includes("/"),"data: cannot have a slash in it.");
        super(data);
    }
}