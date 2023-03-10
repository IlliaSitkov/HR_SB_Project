import { Container } from 'inversify';
import 'reflect-metadata';
import {GenerationRepository} from '../repositories/GenerationRepository';
import {GenerationService} from '../services/GenerationService';
import {CategoryRepository} from '../repositories/CategoryRepository';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';
import {CategoryService} from '../services/CategoryService';
import {UserService} from '../services/UserService';
import {UserRepository} from '../repositories/UserRepository';
import {PersonRepository} from '../repositories/PersonRepository';
import {PersonService} from '../services/PersonService';

const container = new Container();

container.bind<GenerationRepository>(GenerationRepository).to(GenerationRepository);
container.bind<CategoryRepository>(CategoryRepository).to(CategoryRepository);
container.bind<UserRepository>(UserRepository).to(UserRepository);

container.bind<PrismaErrorUtil>(PrismaErrorUtil).to(PrismaErrorUtil);

container.bind<GenerationService>(GenerationService).to(GenerationService);
container.bind<CategoryService>(CategoryService).to(CategoryService);
container.bind<UserService>(UserService).to(UserService);

container.bind<PersonRepository>(PersonRepository).to(PersonRepository);
container.bind<PersonService>(PersonService).to(PersonService);

export { container };
