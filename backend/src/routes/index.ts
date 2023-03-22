import {Router} from 'express';

const router:Router = Router();

import generationRouter from './generationRouter';
import {categoryRouter} from './categoryRouter';
import userRouter from './userRouter';
import {eventRouter} from "./eventRouter";
import personRouter from './personRouter';
import facultyRouter from './facultyRouter';
import specialtyRouter from './specialtyRouter';
import activityRouter from "./activityRouter";

router.use('/generations', generationRouter);
router.use('/categories', categoryRouter);
router.use('/user', userRouter);
router.use('/people', personRouter);
router.use('/events', eventRouter);
router.use('/faculties', facultyRouter);
router.use('/specialties', specialtyRouter);
router.use('/activities', activityRouter);

export default router;
