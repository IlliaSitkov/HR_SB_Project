import { Container } from 'inversify';
import 'reflect-metadata';
import {GenerationRepository} from "../repositories/GenerationRepository";
import {GenerationService} from "../services/GenerationService";

const container = new Container();

container.bind<GenerationRepository>(GenerationRepository).to(GenerationRepository);
container.bind<GenerationService>(GenerationService).to(GenerationService);

export { container };