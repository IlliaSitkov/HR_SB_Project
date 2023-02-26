import express, {Request, Response} from "express";
import {requestValidator} from "../middleware/requestMiddleware";
import {categorySchema} from "../validators/categorySchema";
import asyncHandler from "express-async-handler";
import {container} from "../config/container";
import {CategoryService} from "../services/CategoryService";
import {idSchema} from "../validators/idSchema";
import {Category} from "../models/Category";

export const categoryRouter = express.Router();

const categoryService: CategoryService = container.get<CategoryService>(CategoryService);

categoryRouter.route("/")
    .get(
        asyncHandler(async (req: Request, res: Response) => {
            const categories: Category[] = await categoryService.getAll();
            res.json(categories);
        })
    )
    .post(
        requestValidator(categorySchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const newCategory: Category = await categoryService.create(req.body.name);
            res.json(newCategory);
        })
    );

categoryRouter.route("/:id")
    .put(
        requestValidator(idSchema, "id"),
        requestValidator(categorySchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.update(Number(req.params.id), req.body.name);
            res.json(category);
        })
    )
    .get(
        requestValidator(idSchema, "id"),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.getById(Number(req.params.id));
            res.json(category);
        })
    )
    .delete(
        requestValidator(idSchema, "id"),
        asyncHandler(async (req: Request, res: Response) => {
            const category: Category = await categoryService.deleteById(Number(req.params.id));
            res.json(category);
        })
    );
