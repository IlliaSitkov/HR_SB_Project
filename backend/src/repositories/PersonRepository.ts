import {prisma} from "../datasource/connectDB";
import {ApiError} from "../models/ApiError";
import {PersonPatchDto, PersonPostDto} from "../models/Person";
import {injectable} from "inversify";
import {Status} from "@prisma/client";

@injectable()
export class PersonRepository {

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
            // @ts-ignore
            return prisma.person.create({data: person});
        } catch (err) {
            throw ApiError.badRequest("Людина з такою поштою або таким телефоном вже існує");
        }
    };

    updatePerson = async (id: number, person: PersonPatchDto) => {
        const p = await this.personExists(id);
        try {
            return await prisma.person.update({where: {id},
                data: {
                    name: person.name ? person.name : p.name,
                    parental: person.parental ? person.parental : p.parental,
                    surname: person.surname ? person.surname : p.surname,
                    date_birth: person.date_birth ? person.date_birth : p.date_birth,
                    avatar: person.avatar ? person.avatar : p.avatar,

                    faculty_id: person.faculty ? person.faculty.id : p.faculty_id, // ???
                    specialty_id: person.specialty ? person.specialty.id : p.specialty_id,
                    year_enter: person.year_enter ? person.year_enter : p.year_enter,

                    email: person.email ? person.email : p.email,
                    telephone: person.telephone ? person.telephone : p.telephone,
                    telegram: person.telegram ? person.telegram : p.telegram,
                    facebook: person.facebook ? person.facebook : p.facebook,

                    role: person.role && p.status === Status.BRATCHYK ? person.role : p.role,
                    parent_id: person.parent ? person.parent.id : p.parent_id,
                    //@ts-ignore
                    generation_id: person.generation ? person.generation.id : p.generation_id,
                    about: person.about ? person.about : p.about,

                    date_fill_form: person.date_fill_form ? person.date_fill_form : p.date_fill_form,
                    date_vysviata: person.date_vysviata ? person.date_vysviata : p.date_vysviata,
                    date_poshanuvannia: person.date_poshanuvannia ? person.date_poshanuvannia : p.date_poshanuvannia,
                    date_exclusion: person.date_exclusion ? person.date_exclusion : p.date_exclusion
                }});
        } catch (err) {
            throw ApiError.badRequest(
                "Людина з такою поштою або таким телефоном вже існує"
            );
        }
    };

    deletePersonById = async (id: number) => {
        return prisma.person.delete({where: {id}});
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
}
