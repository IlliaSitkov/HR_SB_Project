import {Request, Response, Router} from "express";
import authMiddleware from "../middleware/authMiddleware";
import {requestValidator} from "../middleware/requestMiddleware";
import {eventCreateSchema, eventUpdateSchema} from "../validators/eventSchema";
import asyncHandler from "express-async-handler";
import {container} from "../config/container";
import {EventService} from "../services/EventService";
import {idSchema} from "../validators/idSchema";
import {Event} from "../models/Event";
import {RoleEnum} from "../utils/enum/Role.enum";

export const eventRouter: Router = Router();

const eventService: EventService = container.get<EventService>(EventService);

eventRouter.route("/")
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const events: Event[] = await eventService.getEvents();
            res.json(events);
        })
    )
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(eventCreateSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const eventDTO = await eventService.checkAndFormatEventDataForPost(req.body);
            const newEvent: Event = await eventService.createEvent(eventDTO);
            res.json(newEvent);
        })
    );

eventRouter.route("/:id")
    .patch(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "id"),
        requestValidator(eventUpdateSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const eventDTO = await eventService.checkAndFormatEventDataForPatch(req.body);
            const updatedEvent: Event = await eventService.updateEvent(Number(req.params.id), eventDTO);
            res.json(updatedEvent);
        })
    )
    .get(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "id"),
        asyncHandler(async (req: Request, res: Response) => {
            const event: Event = await eventService.getEventById(Number(req.params.id));
            res.json(event);
        })
    )
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "id"),
        asyncHandler(async (req: Request, res: Response) => {
            const event: Event = await eventService.deleteEventById(Number(req.params.id));
            res.json(event);
        })
    );

export default eventRouter;