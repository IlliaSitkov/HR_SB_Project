import { Container } from 'inversify';
import 'reflect-metadata';
import {GenerationRepository} from "../repositories/GenerationRepository";
import {GenerationService} from "../services/GenerationService";
import {CategoryRepository} from "../repositories/CategoryRepository";
import {PrismaErrorUtil} from "../datasource/PrismaErrorUtil";
import {CategoryService} from "../services/CategoryService";

const container = new Container();

container.bind<GenerationRepository>(GenerationRepository).to(GenerationRepository);
container.bind<CategoryRepository>(CategoryRepository).to(CategoryRepository);

container.bind<PrismaErrorUtil>(PrismaErrorUtil).to(PrismaErrorUtil);

container.bind<GenerationService>(GenerationService).to(GenerationService);
container.bind<CategoryService>(CategoryService).to(CategoryService);

export { container };