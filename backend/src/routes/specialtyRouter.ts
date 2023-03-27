import {Request, Response, Router} from 'express';
import {container} from '../config/container';
import {SpecialtyService} from '../services/SpecialtyService';
import authMiddleware from '../middleware/authMiddleware';
import {RoleEnum} from '../utils/enum/Role.enum';
import asyncHandler from 'express-async-handler';

const specialtyRouter:Router = Router();

const specialtyService = container.get<SpecialtyService>(SpecialtyService);

// @route GET api/specialties
specialtyRouter.route('/')
    .get(
        // ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        asyncHandler(async (req: Request, res: Response) => {
            const specialties = await specialtyService.getSpecialties();
            res.json(specialties);
        })
    );

export default specialtyRouter;
