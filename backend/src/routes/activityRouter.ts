import {Request, Response, Router} from "express";
import authMiddleware from "../middleware/authMiddleware";
import {requestValidator} from "../middleware/requestMiddleware";
import {activityCreateSchema, activityUpdateSchema} from "../validators/activitySchema";
import asyncHandler from "express-async-handler";
import {container} from "../config/container";
import {ActivityService} from "../services/ActivityService";
import {idSchema} from "../validators/idSchema";
import {Activity} from "../models/Activity";
import {RoleEnum} from "../utils/enum/Role.enum";

export const activityRouter: Router = Router();

const activityService: ActivityService = container.get<ActivityService>(ActivityService);

activityRouter.route("/")
    .get(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "person_id"),
        asyncHandler(async (req: Request, res: Response) => {
            const activity: Activity[] = await activityService.getActivityByPersonId(Number(req.query.person_id));
            res.json(activity);
        })
    )
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(activityCreateSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const activityDTO = await activityService.checkAndFormatActivityDataPost(req.body);
            const newActivity: Activity = await activityService.createActivity(activityDTO);
            res.json(newActivity);
        })
    )
    .patch(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "person_id"),
        requestValidator(idSchema, "event_id"),
        requestValidator(activityUpdateSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const activityDTO = await activityService.checkAndFormatActivityDataPatch(req.body);
            const updatedActivity: Activity = await activityService.updateActivity(Number(req.query.person_id), Number(req.query.event_id), activityDTO);
            res.json(updatedActivity);
        })
    )
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, "person_id"),
        requestValidator(idSchema, "event_id"),
        asyncHandler(async (req: Request, res: Response) => {
            const activity: Activity = await activityService.deleteActivityById(Number(req.query.person_id), Number(req.query.event_id));
            res.json(activity);
        })
    );

export default activityRouter;