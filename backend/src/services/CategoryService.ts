import {inject, injectable} from 'inversify';
import {CategoryRepository} from '../repositories/CategoryRepository';
import {Category} from '../models/Category';

@injectable()
export class CategoryService {

    constructor(@inject(CategoryRepository) private categoryRepository: CategoryRepository) {
    }

    getAll = (): Promise<Category[]> => {
        return this.categoryRepository.getAllCategories();
    }

    getById = (id: number): Promise<Category>=> {
        return this.categoryRepository.getCategoryById(id);
    }

    create = (name: string): Promise<Category> => {
        return this.categoryRepository.createCategory(name);
    }

    update = (id: number, name: string): Promise<Category> => {
        return this.categoryRepository.updateCategory(id, name);
    }

    deleteById = (id: number): Promise<Category> => {
        return this.categoryRepository.deleteCategoryById(id);
    }

}



