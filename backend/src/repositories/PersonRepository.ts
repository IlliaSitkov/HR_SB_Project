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
        return prisma.person.findMany({
            include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }
        });
    };

    personExists = async (id: number) => {
        const person = await prisma.person.findFirst({where: {id}, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
        if (!person) {
            throw ApiError.badRequest(`Людину з id:${id} не знайдено`);
        }
        return person;
    };

    createPerson = async (person: PersonPostDto) => {
        try {
            return await prisma.person.create({data: person, include: {
                    parent: true,
                    faculty: true,
                    specialty: true,
                    generation: true,
                }});
        } catch (err: any) {
            console.log('Err');
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
            {throw  ApiError.badRequest('Передано некоректний статус людини');}
        try {
            return await prisma.person.update({where: {id},
                data: {
                    name: person.name ? person.name : p.name,
                    parental: (person.parental || person.parental === '') ? person.parental : p.parental,
                    surname: person.surname ? person.surname : p.surname,
                    date_birth: (person.date_birth || person.date_birth === null) ? person.date_birth : p.date_birth,
                    avatar: (person.avatar || person.avatar === '') ? person.avatar : p.avatar,

                    faculty_id: (person.faculty_id || person.faculty_id === null) ? person.faculty_id : p.faculty_id,
                    specialty_id: (person.specialty_id  || person.specialty_id === null) ? person.specialty_id : p.specialty_id,
                    year_enter: (person.year_enter || person.year_enter === null) ? person.year_enter : p.year_enter,

                    email: (person.email || person.email === '') ? person.email : p.email,
                    telephone: (person.telephone || person.telephone === '') ? person.telephone : p.telephone,
                    telegram: (person.telegram || person.telegram === '') ? person.telegram : p.telegram,
                    facebook: (person.facebook || person.facebook === '') ? person.facebook : p.facebook,

                    role: (person.role || person.role === null) ? person.role : p.role,
                    parent_id: (person.parent_id || person.parent_id === null) ? person.parent_id : p.parent_id,
                    generation_id: (person.generation_id  || person.generation_id === null) ? person.generation_id : p.generation_id,
                    about: (person.about || person.about === '') ? person.about : p.about,

                    date_fill_form: (person.date_fill_form || person.date_fill_form === null) ? person.date_fill_form : p.date_fill_form,
                    date_vysviata: (person.date_vysviata || person.date_vysviata === null) ? person.date_vysviata : p.date_vysviata,
                    date_poshanuvannia: (person.date_poshanuvannia || person.date_poshanuvannia === null) ? person.date_poshanuvannia : p.date_poshanuvannia,
                    date_exclusion: (person.date_exclusion || person.date_exclusion === null) ? person.date_exclusion : p.date_exclusion
                }, include: {
                    parent: true,
                    faculty: true,
                    specialty: true,
                    generation: true,
                }});
        } catch (err) {
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Людина з такими контактами (поштою, телефоном, телеграмом чи фейсбуком) вже існує');
            } else {
                throw ApiError.internal('Помилка при редагуванні людини');
            }
        }
    };

    updatePersonStatusToMaliuk = async (id: number) => {
        return prisma.person.update({where: {id},
            data: {
                status: Status.MALIUK
            }, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
    };

    updatePersonStatusToBratchyk = async (id: number, date_vysviata: Date) => {
        return prisma.person.update({where: {id},
            data: {
                status: Status.BRATCHYK,
                date_vysviata
            }, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
    };

    updatePersonStatusToPoshanovanyi = async (id: number, date_poshanuvannia: Date) => {
        return prisma.person.update({where: {id},
            data: {
                status: Status.POSHANOVANYI,
                date_poshanuvannia
            }, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
    };

    updatePersonStatusToExBratchyk = async (id: number, date_exclusion: Date) => {
        return prisma.person.update({where: {id},
            data: {
                status: Status.EX_BRATCHYK,
                date_exclusion
            }, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
    };

    deletePersonById = async (id: number) => {
        try {
            return await prisma.person.delete({where: {id}, include: {
                    parent: true,
                    faculty: true,
                    specialty: true,
                    generation: true,
                }});
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Людину з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при видаленні людини');
            }
        }
    };

    findPeopleByGenerationId = async (generation_id: number) => {
        return prisma.person.findMany({where: {generation_id}, include: {
                parent: true,
                faculty: true,
                specialty: true,
                generation: true,
            }});
    };
}
