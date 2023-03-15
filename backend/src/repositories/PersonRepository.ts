import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';
import {PersonPatchDto, PersonPostDto} from '../models/Person';
import {inject, injectable} from 'inversify';
import {Status} from '@prisma/client';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';

@injectable()
export class PersonRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    getPeople = async () => {
        return prisma.person.findMany();
    }

    personExists = async (id: number) => {
        const person = await prisma.person.findFirst({where: {id}});
        if (!person) {
            throw ApiError.badRequest(`Людину з id:${id} не знайдено`);
        }
        return person;
    };

    createPerson = async (person: PersonPostDto) => {
        try {
            return await prisma.person.create({data: person});
        } catch (err: any) {
            console.log("Err");
            console.log(err);
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Людина з такими контактами (поштою, телефоном, телеграмом чи фейсбуком) вже існує');
            } else {
                throw ApiError.internal('Помилка при додаванні людини');
            }
        }
    };

    updatePerson = async (id: number, person: PersonPatchDto) => {
        const p = await this.personExists(id);
        if (p.status !== person.status)
            throw  ApiError.badRequest("Передано некоректний статус людини");
        try {
            return await prisma.person.update({where: {id},
                data: {
                    name: person.name ? person.name : p.name,
                    parental: person.parental ? person.parental : p.parental,
                    surname: person.surname ? person.surname : p.surname,
                    date_birth: person.date_birth ? person.date_birth : p.date_birth,
                    avatar: person.avatar ? person.avatar : p.avatar,

                    faculty_id: person.faculty_id ? person.faculty_id : p.faculty_id, // ???
                    specialty_id: person.specialty_id ? person.specialty_id : p.specialty_id,
                    year_enter: person.year_enter ? person.year_enter : p.year_enter,

                    email: person.email ? person.email : p.email,
                    telephone: person.telephone ? person.telephone : p.telephone,
                    telegram: person.telegram ? person.telegram : p.telegram,
                    facebook: person.facebook ? person.facebook : p.facebook,

                    role: person.role && p.status === Status.BRATCHYK ? person.role : p.role,
                    parent_id: person.parent_id ? person.parent_id : p.parent_id,
                    generation_id: person.generation_id ? person.generation_id : p.generation_id,
                    about: person.about ? person.about : p.about,

                    date_fill_form: person.date_fill_form ? person.date_fill_form : p.date_fill_form,
                    date_vysviata: person.date_vysviata ? person.date_vysviata : p.date_vysviata,
                    date_poshanuvannia: person.date_poshanuvannia ? person.date_poshanuvannia : p.date_poshanuvannia,
                    date_exclusion: person.date_exclusion ? person.date_exclusion : p.date_exclusion
            }});
        } catch (err) {
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Людина з такими контактами (поштою, телефоном, телеграмом чи фейсбуком) вже існує');
            } else {
                throw ApiError.internal('Помилка при додаванні людини');
            }
        }
    };

    updatePersonStatusToMaliuk = async (id: number) => {
        return await prisma.person.update({where: {id},
            data: {
                status: Status.MALIUK
            }});
    }

    updatePersonStatusToBratchyk = async (id: number, date_vysviata: Date) => {
        return await prisma.person.update({where: {id},
            data: {
                status: Status.BRATCHYK,
                date_vysviata: date_vysviata
            }});
    }

    updatePersonStatusToPoshanovanyi = async (id: number, date_poshanuvannia: Date) => {
        return await prisma.person.update({where: {id},
            data: {
                status: Status.POSHANOVANYI,
                date_poshanuvannia: date_poshanuvannia
            }});
    }

    updatePersonStatusToExBratchyk = async (id: number, date_exclusion: Date) => {
        return await prisma.person.update({where: {id},
            data: {
                status: Status.EX_BRATCHYK,
                date_exclusion: date_exclusion
            }});
    }

    deletePersonById = async (id: number) => {
        try {
            return await prisma.person.delete({where: {id}});
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Людину з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при видаленні людини');
            }
        }
    };

    getFaculty = async (id: number | undefined) => {
        let faculty;
        if (id) {
            faculty = await prisma.faculty.findFirst({where: {id}});
            if (!faculty)
                throw ApiError.notFound(`Факультет з id:${id} не знайдено`);
        }
        return faculty;
    }

    getSpecialty = async (id: number | undefined) => {
        let specialty;
        if (id) {
            specialty = await prisma.specialty.findFirst({where: {id}});
            if (!specialty)
                throw ApiError.notFound(`Спеціальність з id:${id} не знайдено`)
        }
        return specialty;
    }

    findPeopleByGenerationId = async (generation_id: number) => {
        return await prisma.person.findMany({where: {generation_id}});
    }
}
