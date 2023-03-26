import {inject, injectable} from 'inversify';
import {PersonRepository} from '../repositories/PersonRepository';
import {Person, PersonBirthday, PersonPatchDto, PersonPostDto} from '../models/Person';
import {Status} from '@prisma/client';
import {ApiError} from '../models/ApiError';
import {GenerationService} from './GenerationService';
import {clearAllBirthdays, createBirthday} from '../utils/googleCalendar';
import {FacultyRepository} from '../repositories/FacultyRepository';
import {SpecialtyRepository} from '../repositories/SpecialtyRepository';
import {RoleEnum} from '../utils/enum/Role.enum';
import {UserService} from './UserService';
import {array} from 'joi';

@injectable()
export class PersonService {

    public constructor(@inject(PersonRepository) private personRepository: PersonRepository,
                       @inject(FacultyRepository) private facultyRepository: FacultyRepository,
                       @inject(SpecialtyRepository) private specialtyRepository: SpecialtyRepository,
                       @inject(GenerationService) private generationService: GenerationService,
                       @inject(UserService) private userService: UserService) {
    }

    private addBirthdayToCalendar = (person: Person) => {
        //There is birthday and person is in organization
        return <boolean>(person.date_birth &&
            !person.date_poshanuvannia &&
            !person.date_exclusion &&
            person.status !== Status.EX_BRATCHYK &&
            person.status !== Status.POSHANOVANYI);
    };

    getPeople = async () => {
        return this.personRepository.getPeople();
    };

    getPersonById = async (id: number) => {
        return this.personRepository.personExists(id);
    };

    createPerson = async (person: PersonPostDto) => {
        const p = await this.personRepository.createPerson(person);
        await this.userService.add({personId: p.id, role: RoleEnum.USER});
        return p;
    };

    updatePerson = async (id: number, person: PersonPatchDto) => {
        const p = await this.personRepository.updatePerson(id, person);
        if (p.email) {
            const user = await this.userService.getUserByEmail(p.email);
            if (!user) {
                await this.userService.add({personId: p.id, role: RoleEnum.USER});
            }
        }
        return p;
    };

    deletePersonById = async (id: number) => {
        //await this.getPersonById(id);
        //TODO: think about dependant events
        const p = await this.personRepository.deletePersonById(id);
        if (p.email) {
            const user = await this.userService.getUserByEmail(p.email);
            if (user) {
                await this.userService.deleteById(user.id);
            }
        }
        return p;
    };

    syncAllBirthdays = async () => {
        await clearAllBirthdays();
        const people = (await this.getPeople()).filter(this.addBirthdayToCalendar);
        for (const person of people) {
            await createBirthday(`${person.name} ${person.surname}`,
                person.date_birth!.getDate(),
                //TODO: there is bug and month returns as real-1
                person.date_birth!.getMonth() + 1);
        }
    };

    checkAndFormatPersonData = async (personData: any) => {
        const faculty = await this.facultyRepository.getFaculty(personData.faculty_id);
        const specialty = await this.specialtyRepository.getSpecialty(personData.specialty_id);
        const parent = personData.parent_id ?
            await this.getPersonById(personData.parent_id) : undefined;
        if (parent && !this.canBeParent(parent)) {
            throw ApiError.badRequest('Ця людина не може бути патроном. Вона має бути братчиком або пошанованим');
        }
        const generation = personData.generation_id ?
            await this.generationService.getGenerationById(personData.generation_id) : undefined;
        const role = (personData.role && personData.status === Status.BRATCHYK) ? personData.role : null;

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
            role,
            parent_id: parent ? parent.id : null,
            generation_id: generation ? generation.id : null,
            about: personData.about,

            date_fill_form: personData.date_fill_form,
            date_vysviata: personData.date_vysviata,
            date_poshanuvannia: personData.date_poshanuvannia,
            date_exclusion: personData.date_exclusion
        };
        return person;
    };

    updateStatus = async (id: number, newStatus: Status, date: Date) => {
        const person = await this.getPersonById(id);
        if (newStatus === person.status) {
            return person;
        }
        //newcomer -> maliuk
        if (person.status === Status.NEWCOMER && newStatus === Status.MALIUK) {
            return this.personRepository.updatePersonStatusToMaliuk(id);
        }
        //maliuk -> bratchyk (add date_vysviata)
        if (person.status === Status.MALIUK && newStatus === Status.BRATCHYK) {
            return this.personRepository.updatePersonStatusToBratchyk(id, date);
        }
        if (person.status === Status.BRATCHYK) {
            // bratchyk -> poshanovanyi (add date_poshanuvannia)
            if (newStatus === Status.POSHANOVANYI) {
                return this.personRepository.updatePersonStatusToPoshanovanyi(id, date);
            }
            // bratchyk -> exBrathyk (add date_exclusion)
            if (newStatus === Status.EX_BRATCHYK) {
                return this.personRepository.updatePersonStatusToExBratchyk(id, date);
            }
        }
        throw ApiError.badRequest('Статус не може бути оновлено');
    };

    nearestBirthdays = async () => {
        const people = (await this.getPeople()).filter(this.addBirthdayToCalendar);

        const birthdays: PersonBirthday[] = people.map((person: Person) => {
            return {
                birthday: person.date_birth!,
                name: person.name,
                parental: person.parental,
                surname: person.surname,
                email: person.email,
                avatar: person.avatar
            };
        });

        //Get sorted set of birthdays dates
        const today = new Date();
        const birthArrays = [...new Set(birthdays.map(person => JSON.stringify([person.birthday?.getDate(), person.birthday?.getMonth()])))]
            .map((array) => {
                const [date, month] = JSON.parse(array);

                if (month < today.getMonth() ||
                    month === today.getMonth() && date < today.getDate()) {
                    return new Date(today.getFullYear() + 1, month, date);
                }
                return new Date(today.getFullYear(), month, date);
            })
            .sort((a, b) => a.getTime() - b.getTime());

        if (birthdays.length === 0) {
            return birthdays;
        }

        return birthdays.filter(person => person.birthday?.getMonth() === birthArrays[0].getMonth() &&
            person.birthday?.getDate() === birthArrays[0].getDate());
    };

    canBeParent = (parent: Person | undefined) => {
        return parent && (parent.status === Status.BRATCHYK || parent.status === Status.POSHANOVANYI);
    };
}
