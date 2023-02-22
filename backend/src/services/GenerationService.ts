import {GenerationRepository} from "../repositories/GenerationRepository";
import {ApiError} from "../models/ApiError";
import {Generation, GenerationDto} from "../models/Generation";

export class GenerationService {

    private generationRepository: GenerationRepository;

    public constructor(generationRepository: GenerationRepository) {
        this.generationRepository = generationRepository;
    }

    getGenerations = async () => {
        return this.generationRepository.getGenerations();
    };

    getGenerationById = async (id: number) => {
        return this.generationRepository.generationExists(id);
    };

    createGeneration = async (generation: GenerationDto) => {
        const gen = await this.generationRepository.createGeneration(generation);
        return gen;
    };

    updateGeneration = async (id: number, generation: GenerationDto) => {
        return this.generationRepository.updateGeneration(id, generation);
    };

    deleteGenerationById = async (id: number) => {
        await this.getGenerationById(id);
        if (await this.isThereDependentPerson(id)) {
            throw ApiError.badRequest(
                "Присутні люди з цього покоління. Покоління не може бути видалене"
            );
        }
        return this.generationRepository.deleteGenerationById(id);
    };

    isThereDependentPerson = async (id: number) => {
        // TODO: change after person service and repo implemented with method findPeopleByGenerationId()
        /*const dependentPeople = await Person.find({ generation_id: id });
        return dependentPeople.length > 0;*/
        return false;
    };

    checkAndFormatGenerationData = (generationData: any) => {
        const generation: Generation = {
            name: generationData.name
        }
        return generation;
    };

}
