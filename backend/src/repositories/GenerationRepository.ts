import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';
import {GenerationDto} from '../models/Generation';
import {inject, injectable} from 'inversify';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';

@injectable()
export class GenerationRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    getGenerations = async () => {
        return prisma.generation.findMany();
    }

    generationExists = async (id: number) => {
        const generation = await prisma.generation.findFirst({where: {id}});
        if (!generation) {
            throw ApiError.notFound(`Покоління з id:${id} не знайдено`);
        }
        return generation;
    };

    createGeneration = async (generation: GenerationDto) => {
        try {
            return await prisma.generation.create({data: generation});
        } catch (err) {
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Покоління з такою назвою вже існує');
            } else {
                throw ApiError.internal('Помилка при додаванні покоління');
            }
        }
    };

    updateGeneration = async (id: number, generation: GenerationDto) => {
        const g = await this.generationExists(id);
        if (g.name === generation.name) {
            return g;
        }
        try {
            return await prisma.generation.update({where: {id}, data: generation});
        } catch (err) {
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Покоління з такою назвою вже існує');
            } else {
                throw ApiError.internal('Помилка при редагуванні покоління');
            }
        }
    };

    deleteGenerationById = async (id: number) => {
        try {
            return await prisma.generation.delete({where:{id}});
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Покоління з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при видаленні покоління');
            }
        }
    };
}
