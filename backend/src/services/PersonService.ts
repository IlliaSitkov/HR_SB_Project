import {inject, injectable} from 'inversify';
import {PersonRepository} from '../repositories/PersonRepository';
import {Person, PersonPatchDto, PersonPostDto} from '../models/Person';
import {Status} from '@prisma/client';
import {ApiError} from '../models/ApiError';
import {GenerationService} from './GenerationService';

@injectable()
export class PersonService {

    public constructor(@inject(PersonRepository) private personRepository: PersonRepository,
                       @inject(GenerationService) private generationService: GenerationService) {}

    getPeople = async () => {
        return this.personRepository.getPeople();
    };

    getPersonById = async (id: number) => {
        return this.personRepository.personExists(id);
    };

    createPerson = async (person: PersonPostDto) => {
        return this.personRepository.createPerson(person);
    };

    updatePerson = async (id: number, person: PersonPatchDto) => {
        return this.personRepository.updatePerson(id, person);
    };

    deletePersonById = async (id: number) => {
        // await this.getPersonById(id);
        // TODO: think about dependant events
        return this.personRepository.deletePersonById(id);
    };

    checkAndFormatPersonData = async (personData: any) => {
        const faculty = await this.personRepository.getFaculty(personData.faculty_id);
        const specialty = await this.personRepository.getSpecialty(personData.specialty_id);
        const parent = personData.parent_id ?
            await this.getPersonById(personData.parent_id) : undefined;
        if (parent && !this.canBeParent(parent))
            throw ApiError.badRequest('Ця людина не може бути патроном. Вона має бути братчиком або пошанованим');
        const generation = personData.generation_id ?
            await this.generationService.getGenerationById(personData.generation_id) : undefined;
        const role = personData.role && personData.status === Status.BRATCHYK ? personData.role : undefined;

        const person: Person = {
            name: personData.name,
            parental: personData.parental,
            surname: personData.surname,
            date_birth: personData.date_birth,
            avatar: personData.avatar,

            faculty_id: faculty ? faculty.id : null,
            specialty_id: specialty ? specialty.id : null,
            year_enter: personData.year_enter,

            email: personData.email,
            telephone: personData.telephone,
            telegram: personData.telegram,
            facebook: personData.facebook,

            status: personData.status,
            role: role,
            parent_id: parent ? parent.id : null,
            generation_id: generation ? generation.id : null,
            about: personData.about,

            date_fill_form: personData.date_fill_form,
            date_vysviata: personData.date_vysviata,
            date_poshanuvannia: personData.date_poshanuvannia,
            date_exclusion: personData.date_exclusion
        }
        return person;
    };

    updateStatus = async (id: number, status: Status, date: Date) => {
        const person = await this.getPersonById(id);
        if (status === person.status)
            return person;
        // newcomer -> maliuk
        if (person.status === Status.NEWCOMER && status === Status.MALIUK)
            return await this.personRepository.updatePersonStatusToMaliuk(id);
        // maliuk -> bratchyk (add date_vysviata)
        if (person.status === Status.MALIUK && status === Status.BRATCHYK)
            return await this.personRepository.updatePersonStatusToBratchyk(id, date);
        if (person.status === Status.BRATCHYK) {
            // bratchyk -> poshanovanyi (add date_poshanuvannia)
            if (status === Status.POSHANOVANYI)
                return await this.personRepository.updatePersonStatusToPoshanovanyi(id, date);
            // bratchyk -> exBrathyk (add date_exclusion)
            if (status === Status.EX_BRATCHYK)
                return await this.personRepository.updatePersonStatusToExBratchyk(id, date);
        }
        throw ApiError.badRequest('Статус не може бути оновлено');
    };

    canBeParent = (parent: Person | undefined) => {
        return parent && (parent.status === Status.BRATCHYK || parent.status === Status.POSHANOVANYI);
    }
}
