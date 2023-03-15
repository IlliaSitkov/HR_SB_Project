import {Request, Response, Router} from "express";
import {container} from "../config/container";
import {FacultyService} from "../services/FacultyService";
import authMiddleware from "../middleware/authMiddleware";
import {RoleEnum} from "../utils/enum/Role.enum";
import asyncHandler from "express-async-handler";

const facultyRouter:Router = Router();

const facultyService = container.get<FacultyService>(FacultyService);

// @route GET api/faculties
facultyRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        asyncHandler(async (req: Request, res: Response) => {
            const faculties = await facultyService.getFaculties();
            res.json(faculties);
        })
    );

export default facultyRouter;
