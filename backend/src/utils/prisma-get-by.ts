import { Prisma } from "@prisma/client";

export const prismaGetBy = <P>(prismaModel:any) => {

    return async <T>(field:string, value: T, select: P) => {
        return await prismaModel.findUnique({
            where: {
            [field]: value 
            
            },
            select
        }); 
        }
    
}