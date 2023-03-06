import {Category} from '../models/Category';
import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';

@injectable()
export class CategoryRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    getAllCategories = (): Promise<Category[]> => {
        return prisma.category.findMany({orderBy: {id: 'asc'}});
    }

    createCategory = async (name: string): Promise<Category> => {
        try {
            return await prisma.category.create({
                data: {name}
            });
        } catch (e: any) {
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest('Категорія з такою назвою вже існує');
            } else {
                throw ApiError.internal('Помилка при додаванні категорії');
            }
        }
    }

    updateCategory = async (id: number, name: string): Promise<Category> => {
        const category: Category = await this.getCategoryById(id);
        if (category.name === name) {
            return category;
        }
        try {
            return await prisma.category.update({where:{id}, data:{name}});
        } catch (e: any) {
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest('Категорія з такою назвою вже існує');
            } else {
                throw ApiError.internal('Помилка при редагуванні категорії');
            }
        }
    }

    getCategoryById = async (id: number): Promise<Category> => {
        try {
            return await prisma.category.findUniqueOrThrow({where:{id}});
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Категорію з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при отриманні категорії');
            }
        }
    }

    deleteCategoryById = async (id: number): Promise<Category> => {
        try {
            return await prisma.category.delete({where:{id}});
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Категорію з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при видаленні категорії');
            }
        }
    }

}
