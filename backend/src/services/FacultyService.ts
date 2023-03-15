import {inject, injectable} from "inversify";
import {FacultyRepository} from "../repositories/FacultyRepository";
import {Category} from "../models/Category";

@injectable()
export class FacultyService {

    constructor(@inject(FacultyRepository) private facultyRepository: FacultyRepository) {
    }

    getFaculties = (): Promise<Category[]> => {
        return this.facultyRepository.getFaculties();
    };

}
