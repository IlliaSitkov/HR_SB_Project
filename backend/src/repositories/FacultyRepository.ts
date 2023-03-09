import {injectable} from 'inversify';
import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';

@injectable()
export class FacultyRepository {

    getFaculty = async (id: number | undefined) => {
        let faculty;
        if (id) {
            faculty = await prisma.faculty.findFirst({where: {id}});
            if (!faculty)
            {throw ApiError.notFound(`Факультет з id:${id} не знайдено`);}
        }
        return faculty;
    };

    getFaculties = async () => {
        return prisma.faculty.findMany();
    };

}
