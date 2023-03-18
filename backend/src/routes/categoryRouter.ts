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
import {prisma} from '../datasource/connectDB';

export const categoryRouter = express.Router();

const categoryService: CategoryService = container.get<CategoryService>(CategoryService);

categoryRouter.route('/activities')
    .delete(...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const person_id = +req.body.person_id!;
            const event_id = +req.body.event_id!;
            const result = await prisma.activity.deleteMany(
                {
                    where: {
                        person_id, event_id
                    }
                });
            res.json(result);
        }))
    .put(...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const person_id = +req.body.person_id!;
            const event_id = +req.body.event_id!;
            const position = req.body.position;
            const contribution = req.body.contribution;
            const hours = +req.body.hours!;
            const result = await prisma.activity.updateMany(
                {
                    where: {
                        person_id, event_id
                    },
                    data: {
                        position, contribution, hours
                    }
                });
            res.json(result);
        }))
    .post(...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const person_id = +req.body.person_id!;
            const event_id = +req.body.event_id!;
            const position = 'Учасник';
            const contribution = 'Організація події';
            const hours = 0;
            const result = await prisma.activity.create(
                {
                    data: {
                        position, contribution, hours, person_id, event_id
                    }
                });
            res.json(result);
        }))
    .get(...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const personId = +req.query.personId!;
            const eventId = +req.query.eventId!;
            let activities: any = [];
            if (personId) {
                activities = await prisma.activity.findMany(
                    {
                        where: {
                            person_id: personId
                        },
                        include: {
                            person: {
                                select: {
                                    name: true,
                                    parental: true,
                                    surname: true,
                                    status: true
                                },
                            },
                            event: {
                                select: {
                                    name: true,
                                    date_start: true
                                }
                            }
                        },
                        orderBy: {
                            event: {
                                date_start: 'desc'
                            }
                        }
                    });
            } else if (eventId) {
                activities = await prisma.activity.findMany(
                    {
                        where: {
                            event_id: eventId
                        },
                        include: {
                            person: {
                                select: {
                                    name: true,
                                    parental: true,
                                    surname: true,
                                    status: true
                                },
                            },
                            event: {
                                select: {
                                    name: true,
                                    date_start: true
                                }
                            }
                        },
                        orderBy: {
                            event: {
                                date_start: 'desc'
                            }
                        }
                    });
            }
            res.json(activities);
        }));


categoryRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR),
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
        ...authMiddleware(RoleEnum.HR),
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
