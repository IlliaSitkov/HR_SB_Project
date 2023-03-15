import {inject, injectable} from "inversify";
import {PrismaErrorUtil} from "../datasource/PrismaErrorUtil";
import {prisma} from "../datasource/connectDB";
import {ApiError} from "../models/ApiError";

@injectable()
export class SpecialtyRepository {

    getSpecialty = async (id: number | undefined) => {
        let specialty;
        if (id) {
            specialty = await prisma.specialty.findFirst({where: {id}});
            if (!specialty)
            {throw ApiError.notFound(`Спеціальність з id:${id} не знайдено`);}
        }
        return specialty;
    };

    getSpecialties = async () => {
        return prisma.specialty.findMany();
    };

}
