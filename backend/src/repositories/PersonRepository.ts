import {prisma} from "../datasource/connectDB";
import {ApiError} from "../models/ApiError";
import {PersonPatchDto, PersonPostDto} from "../models/Person";
import {injectable} from "inversify";

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
        try {
            // @ts-ignore
            await prisma.person.update({where: {id}, data: person});
            return await this.personExists(id);
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
