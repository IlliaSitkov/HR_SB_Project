import {prisma} from "../config/connectDB";
import {ApiError} from "../models/ApiError";
import {GenerationDto} from "../models/Generation";

export class GenerationRepository {

    getGenerations = async () => {
        return prisma.generation.findMany();
    }

    generationExists = async (id: number) => {
        const generation = await prisma.generation.findFirst({where: {id}});
        if (!generation) {
            throw ApiError.badRequest(`Покоління з id:${id} не знайдено`);
        }
        return generation;
    };

    createGeneration = async (generation: GenerationDto) => {
        try {
            return prisma.generation.create({data: generation});
        } catch (err) {
            throw ApiError.badRequest("Покоління з такою назвою вже існує");
        }
    };

    updateGeneration = async (id: number, generation: GenerationDto) => {
        try {
            await prisma.generation.update({where: {id}, data: generation});
            return await this.generationExists(id);
        } catch (err) {
            throw ApiError.badRequest(
                "Покоління з такою назвою вже існує"
            );
        }
    };

    deleteGenerationById = async (id: number) => {
        return prisma.generation.delete({where: {id}});
    };
}
