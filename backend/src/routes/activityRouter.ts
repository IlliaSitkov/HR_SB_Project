import {Request, Response, Router} from 'express';
import authMiddleware, {newcomerAccessMiddleware} from '../middleware/authMiddleware';
import {requestValidator} from '../middleware/requestMiddleware';
import {activityCreateSchema, activityDeleteSchema, activityUpdateSchema} from '../validators/activitySchema';
import asyncHandler from 'express-async-handler';
import {container} from '../config/container';
import {ActivityService} from '../services/ActivityService';
import {idSchema} from '../validators/idSchema';
import {Activity} from '../models/Activity';
import {RoleEnum} from '../utils/enum/Role.enum';

export const activityRouter: Router = Router();

const activityService: ActivityService = container.get<ActivityService>(ActivityService);

activityRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER, RoleEnum.NEWCOMER),
        requestValidator(idSchema, 'personId'),
        requestValidator(idSchema, 'eventId'),
        newcomerAccessMiddleware(false),
        asyncHandler(async (req: Request, res: Response) => {
            const personId = req.query.personId;
            const eventId = req.query.eventId;
            let activities: Activity[] = [];
            if (personId) {
                activities = await activityService.getActivitiesByPersonId(Number(personId));
            } else if (eventId) {
                activities = await activityService.getActivitiesByEventId(Number(eventId));
            }
            res.json(activities);
        }))
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(activityCreateSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const activityDTO = await activityService.checkAndFormatActivityDataPost(req.body);
            const newActivity: Activity = await activityService.createActivity(activityDTO);
            res.json(newActivity);
        })
    )
    .put(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(activityUpdateSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const activityDTO = await activityService.checkAndFormatActivityDataPut(req.body);
            //@ts-ignore
            const updatedActivities: Activity[] = await activityService.updateActivity(activityDTO);
            res.json(updatedActivities);
        })
    )
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(activityDeleteSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            //@ts-ignore
            const activities: Activity[] = await activityService.deleteActivityById(Number(req.body.person_id), Number(req.body.event_id));
            res.json(activities);
        })
    );

export default activityRouter;
