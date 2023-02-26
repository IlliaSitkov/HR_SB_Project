import {ApiError} from '../models/ApiError';
import {Generation, GenerationDto} from '../models/Generation';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {GenerationRepository} from '../repositories/GenerationRepository';
import {PersonRepository} from '../repositories/PersonRepository';

@injectable()
export class GenerationService {

    public constructor(@inject(GenerationRepository) private generationRepository: GenerationRepository,
                       @inject(PersonRepository) private personRepository: PersonRepository) {}

    getGenerations = async () => {
        return this.generationRepository.getGenerations();
    };

    getGenerationById = async (id: number) => {
        return this.generationRepository.generationExists(id);
    };

    createGeneration = async (generation: GenerationDto) => {
        return await this.generationRepository.createGeneration(generation);
    };

    updateGeneration = async (id: number, generation: GenerationDto) => {
        return this.generationRepository.updateGeneration(id, generation);
    };

    deleteGenerationById = async (id: number) => {
        await this.getGenerationById(id);
        if (await this.isThereDependentPerson(id)) {
            throw ApiError.badRequest(
                'Присутні люди з цього покоління. Покоління не може бути видалене'
            );
        }
        return this.generationRepository.deleteGenerationById(id);
    };

    isThereDependentPerson = async (id: number) => {
        const dependentPeople = await this.personRepository.findPeopleByGenerationId(id);
        return dependentPeople.length > 0;
    };

    checkAndFormatGenerationData = (generationData: any) => {
        const generation: Generation = {
            name: generationData.name
        }
        return generation;
    };

}
