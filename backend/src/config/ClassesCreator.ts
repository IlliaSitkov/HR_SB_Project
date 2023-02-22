import {GenerationRepository} from "../repositories/GenerationRepository";
import {GenerationService} from "../services/GenerationService";

export class ClassesCreator {

    private static instance: ClassesCreator;

    private generationRepository: GenerationRepository;
    private generationService: GenerationService;

    private constructor() {
        this.generationRepository = new GenerationRepository();
        this.generationService = new GenerationService(this.generationRepository);
    }

    static getInstance(): ClassesCreator {
        if (!ClassesCreator.instance) {
            ClassesCreator.instance = new ClassesCreator();
        }
        return ClassesCreator.instance;
    }

    getGenerationRepository = (): GenerationRepository => {
        return this.generationRepository;
    }

    getGenerationService = (): GenerationService => {
        return this.generationService;
    }

}
