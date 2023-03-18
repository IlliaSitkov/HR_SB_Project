import {inject, injectable} from 'inversify';
import {SpecialtyRepository} from '../repositories/SpecialtyRepository';
import {Category} from '../models/Category';

@injectable()
export class SpecialtyService {

    constructor(@inject(SpecialtyRepository) private specialtyRepository: SpecialtyRepository) {
    }

    getSpecialties = (): Promise<Category[]> => {
        return this.specialtyRepository.getSpecialties();
    };

}
