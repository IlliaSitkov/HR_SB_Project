import express, {Request, Response} from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {requestValidator} from '../middleware/requestMiddleware';
import {eventSchema} from '../validators/eventSchema';
import asyncHandler from 'express-async-handler';
import {container} from '../config/container';
import {EventService} from '../services/EventService';
import {idSchema} from '../validators/idSchema';
import {Event} from '../models/Event';
import {RoleEnum} from '../utils/enum/Role.enum';

export const eventRouter = express.Router();

const eventService: EventService = container.get<EventService>(EventService);

eventRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const events: Event[] = await eventService.getAll();
            res.json(events);
        })
    )
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(eventSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const newEvent: Event = await eventService.create(req.body.name, req.body.date_start, req.body.date_end, req.body.description, req.body.category_id, req.body.photo);
            res.json(newEvent);
        })
    );

eventRouter.route('/:id')
    .put(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'id'),
        requestValidator(eventSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const event: Event = await eventService.update(Number(req.params.id), req.body.name, req.body.date_start, req.body.date_end, req.body.description, req.body.category_id, req.body.photo);
            res.json(event);
        })
    )
    .get(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'id'),
        asyncHandler(async (req: Request, res: Response) => {
            const event: Event = await eventService.getById(Number(req.params.id));
            res.json(event);
        })
    )
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'id'),
        asyncHandler(async (req: Request, res: Response) => {
            const event: Event = await eventService.deleteById(Number(req.params.id));
            res.json(event);
        })
    );