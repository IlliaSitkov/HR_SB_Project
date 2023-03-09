import express, {Request, Response} from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {requestValidator} from '../middleware/requestMiddleware';
import {categorySchema} from '../validators/categorySchema';
import asyncHandler from 'express-async-handler';
import {container} from '../config/container';
import {CategoryService} from '../services/CategoryService';
import {Category} from '../models/Category';
import {RoleEnum} from '../utils/enum/Role.enum';
import {idSchema} from '../validators/idSchema';

export const categoryRouter = express.Router();

const categoryService: CategoryService = container.get<CategoryService>(CategoryService);

categoryRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        asyncHandler(async (req: Request, res: Response) => {
            const categories: Category[] = await categoryService.getAll();
            res.json(categories);
        })
    )
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(categorySchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const newCategory: Category = await categoryService.create(req.body.name);
            res.json(newCategory);
        })
    );

categoryRouter.route('/:id')
    .put(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'id'),
        requestValidator(categorySchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.update(Number(req.params.id), req.body.name);
            res.json(category);
        })
    )
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        requestValidator(idSchema, 'id'),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.getById(Number(req.params.id));
            res.json(category);
        })
    )
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'id'),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.deleteById(Number(req.params.id));
            res.json(category);
        })
    );
